# Escape every '.' in the domain_name to '\.'; Terraform needs "\\." to emit a literal "\\."
locals {
  # "\\\." in HCL ⇒ produces a single "\." in the rendered value
  escaped_domain = replace(var.domain_name, ".", "\\.")
  redis_parts    = split(":", var.redis_endpoint)
  redis_host     = element(local.redis_parts, 0)
  redis_port     = tonumber(element(local.redis_parts, 1))

  # Staging-specific environment variables
  staging_env_vars = var.environment_name == "staging" ? [
    {
      name  = "SERVER_EMAIL_VERIFICATION_TOKEN_COOLDOWN"
      value = "20"
    },
    {
      name  = "SERVER_PASSWORD_RESET_TOKEN_COOLDOWN"
      value = "20"
    }
  ] : []
}

# Use the provided VPC ID instead of default VPC
data "aws_vpc" "main" {
  id = var.vpc_id
}

# Get private subnets from the specified VPC
data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }

  filter {
    name   = "map-public-ip-on-launch"
    values = [false]
  }
}

# Get public subnets from the specified VPC (for ALB)
data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }

  filter {
    name   = "map-public-ip-on-launch"
    values = [true]
  }
}

# Filter private subnets to exclude us-east-1e where t3a.medium is not available
data "aws_subnets" "t3a_compatible_public" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }

  filter {
    name   = "map-public-ip-on-launch"
    values = [true]
  }

  filter {
    name   = "availability-zone"
    values = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1f"]
  }
}

data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.resource_prefix}-ecs-task-execution-role"

  tags = {
    Environment = var.environment_name
  }

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Add the required ECS task execution role policy
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

}

resource "aws_iam_role_policy" "ecs_task_custom_policy" {
  name = "${var.resource_prefix}-ecs-task-custom-policy"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = aws_iam_policy.lambda_custom_policy.policy
}

resource "aws_iam_role_policy" "ecs_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth-ecs"
  role = aws_iam_role.ecs_task_execution_role.id


  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sts:AssumeRole",
          "sts:GetCallerIdentity"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "ecs_instance_role" {
  name = "${var.resource_prefix}-ecs-instance-role"

  tags = {
    Environment = var.environment_name
  }

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role_attach" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_security_group" "alb_sg" {
  name   = "${var.resource_prefix}-alb-sg-new"
  vpc_id = data.aws_vpc.main.id

  tags = {
    Environment = var.environment_name
  }

  lifecycle {
    create_before_destroy = true
  }

  # TODO: allow this only from subnet IP in staging env
  ingress {
    description      = "Allow HTTPS traffic from the internet"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}


resource "aws_security_group" "ecs_sg" {
  name   = "${var.resource_prefix}-ecs-sg"
  vpc_id = var.vpc_id

  tags = {
    Environment = var.environment_name
  }
}

# Allow ECS instances to communicate with each other on Docker ports (I dont think we need this)
# resource "aws_security_group_rule" "ingress_docker_ports" {
#   type              = "ingress"
#   from_port         = 32768
#   to_port           = 61000
#   protocol          = "-1"
#   cidr_blocks       = [data.aws_vpc.main.cidr_block]
#   security_group_id = aws_security_group.ecs_sg.id
#   description       = "Allow ECS instances to communicate with each other on Docker ports"
# }

# resource "aws_security_group_rule" "ingress_docker_ports_ipv6" {
#   type              = "ingress"
#   from_port         = 32768
#   to_port           = 61000
#   protocol          = "-1"
#   ipv6_cidr_blocks  = [data.aws_vpc.main.ipv6_cidr_block]
#   security_group_id = aws_security_group.ecs_sg.id
#   description       = "Allow ECS instances to communicate with each other on Docker ports"
# }


resource "aws_security_group_rule" "ingress_docker_ports" {
  type                     = "ingress"
  from_port                = 32768
  to_port                  = 61000
  protocol                 = "-1"
  source_security_group_id = aws_security_group.alb_sg.id # Only ALB can access
  security_group_id        = aws_security_group.ecs_sg.id
  description              = "Allow ALB health checks on Docker ports"
}


# Allow ALB to reach ECS on port 8000 (I dont think we need this)
# resource "aws_vpc_security_group_ingress_rule" "allow_alb_to_ecs_8000" {
#   depends_on                   = [aws_security_group.alb_sg]
#   description                  = "Allow ALB to reach ECS on port 8000"
#   security_group_id            = aws_security_group.ecs_sg.id
#   referenced_security_group_id = aws_security_group.alb_sg.id
#   from_port                    = 8000
#   to_port                      = 8000
#   ip_protocol                  = "tcp"
# }

# Allow SSH access for debugging (consider removing in production)
resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
  security_group_id = aws_security_group.ecs_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh_ipv6" {
  security_group_id = aws_security_group.ecs_sg.id
  cidr_ipv6         = "::/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}

# resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
#   security_group_id = aws_security_group.ecs_sg.id
#   cidr_ipv4         = "0.0.0.0/0"
#   from_port         = 80
#   ip_protocol       = "tcp"
#   to_port           = 80
# }

# resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv6" {
#   security_group_id = aws_security_group.ecs_sg.id
#   cidr_ipv6         = "::/0"
#   from_port         = 80
#   ip_protocol       = "tcp"
#   to_port           = 80
# }





# resource "aws_vpc_security_group_ingress_rule" "allow_container_http_ipv6" {
#   security_group_id = aws_security_group.ecs_sg.id
#   cidr_ipv6         = "::/0"
#   from_port         = 8000
#   ip_protocol       = "tcp"
#   to_port           = 8000
# }
# resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4" {
#   security_group_id = aws_security_group.ecs_sg.id
#   cidr_ipv4         = "0.0.0.0/0"
#   from_port         = 443
#   ip_protocol       = "tcp"
#   to_port           = 443
# }

# resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv6" {
#   security_group_id = aws_security_group.ecs_sg.id
#   cidr_ipv6         = "::/0"
#   from_port         = 443
#   ip_protocol       = "tcp"
#   to_port           = 443
# }

# Allow all outbound traffic (ECS instances need this for internet access via NAT Gateway)
resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.ecs_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv6" {
  security_group_id = aws_security_group.ecs_sg.id
  cidr_ipv6         = "::/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}


# Removed capacity reservation to avoid AZ mismatch issues
# resource "aws_ec2_capacity_reservation" "ecs" {
#   instance_type     = "t3a.medium" # match your ASG/Launch Template
#   instance_platform = "Linux/UNIX"
#   availability_zone = data.aws_subnet.default_az_a.availability_zone
#   instance_count    = 1 # number of instances to reserve
#   ebs_optimized     = true
#   tenancy           = "default"
#
#   tags = {
#     Environment = var.environment_name
#   }
# }



resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "${var.resource_prefix}-ecs-launch-template-"
  image_id      = data.aws_ami.ecs_optimized.id
  instance_type = "t3a.medium"

  update_default_version = true

  tags = {
    Environment = var.environment_name
  }

  key_name = "ec2-debug"

  # Removed capacity reservation to avoid AZ mismatch issues
  # capacity_reservation_specification {
  #   capacity_reservation_target {
  #     capacity_reservation_id = aws_ec2_capacity_reservation.ecs.id
  #   }
  # }

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  network_interfaces {
    associate_public_ip_address = true
    device_index                = 0
    security_groups             = [aws_security_group.ecs_sg.id]
    ipv6_address_count          = 1
    # subnet_id                   = element(data.aws_subnets.t3a_compatible_private.ids, 0)
  }

  # vpc_security_group_ids = [aws_security_group.ecs_sg.id]

  user_data = base64encode(<<EOF
#!/bin/bash
echo "ECS_CLUSTER=${aws_ecs_cluster.ecs.name}" >> /etc/ecs/ecs.config
echo "ECS_ENABLE_TASK_IAM_ROLE=true" >> /etc/ecs/ecs.config
echo "ECS_ENABLE_CONTAINER_METADATA=true" >> /etc/ecs/ecs.config
EOF
  )
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "${var.resource_prefix}-ecs-instance-profile"

  tags = {
    Environment = var.environment_name
  }

  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_autoscaling_group" "ecs_asg" {
  # For staging: allow scaling down to 0, for production: ensure at least 1 instance
  protect_from_scale_in     = var.environment_name == "production" ? true : false
  name                      = "${var.resource_prefix}-backend-asg"
  desired_capacity          = var.environment_name == "staging" ? 0 : 1
  max_size                  = var.environment_name == "staging" ? 1 : 2
  min_size                  = var.environment_name == "staging" ? 0 : 1
  vpc_zone_identifier       = data.aws_subnets.t3a_compatible_public.ids
  health_check_type         = "EC2"
  health_check_grace_period = 45                 # Increased to allow ECS agent to start
  termination_policies      = ["OldestInstance"] # Terminate oldest instances first
  default_cooldown          = 60

  launch_template {
    id      = aws_launch_template.ecs_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.resource_prefix}-ecs-instance"
    propagate_at_launch = true
  }
  tag {
    key                 = "Environment"
    value               = var.environment_name
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_ecs_capacity_provider" "asg_capacity_provider" {
  name = "${var.resource_prefix}-asg-provider"

  tags = {
    Environment = var.environment_name
  }

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn

    # Enable termination protection for production to prevent accidental instance termination
    managed_termination_protection = var.environment_name == "production" ? "ENABLED" : "DISABLED"
    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = var.environment_name == "staging" ? 1 : 100
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 1
      instance_warmup_period    = var.environment_name == "staging" ? 0 : 300
    }
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_ecs_cluster_capacity_providers" "attach_provider" {
  cluster_name = aws_ecs_cluster.ecs.name


  capacity_providers = [aws_ecs_capacity_provider.asg_capacity_provider.name]

  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.asg_capacity_provider.name
    weight            = 1
    base              = 0
  }
}


resource "aws_ecs_cluster" "ecs" {
  name = "${var.resource_prefix}-ecs-cluster"

  tags = {
    Environment = var.environment_name
  }
}


resource "aws_ecs_task_definition" "app" {
  family                   = "${var.resource_prefix}-app-task"
  requires_compatibilities = ["EC2"]
  network_mode             = "bridge" # or "host"
  cpu                      = "1024"
  memory                   = "1024"

  task_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  tags = {
    Environment = var.environment_name
  }


  container_definitions = jsonencode([
    {
      name      = "my-app"
      image     = "${var.aws_lambda_backend_repository_url}:${var.environment_name}-latest"
      cpu       = 1024
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 0 # required in host mode
          protocol      = "tcp"
        }
      ],
      stopTimeout = 10,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = "/ecs/${var.resource_prefix}-app"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      },

      environment = concat([
        {
          name  = "AWS_DEFAULT_REGION",
          value = var.aws_region
        },
        {
          name  = "SERVER_DEBUG"
          value = "False"
        },
        {
          name  = "SERVER_ENVIRONMENT"
          value = var.environment_name
        },
        {
          name  = "SERVER_DATABASE_URL"
          value = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
        },
        {
          name  = "SERVER_DEFAULT_DATABASE_NAME"
          value = var.mongodb_database_name
        },
        {
          name  = "SERVER_HOST"
          value = "0.0.0.0"
        },
        {
          name  = "SERVER_PORT"
          value = "8000"
        },
        {
          name  = "SERVER_LOG_LEVEL"
          value = "DEBUG"
        },
        {
          name  = "SERVER_CORS_ALLOW_ORIGINS"
          value = "[\"https://${var.domain_name}\", \"https://recruiter.${var.domain_name}\", \"https://accounts.${var.domain_name}\"]"
        },
        {
          name  = "SERVER_CORS_ALLOW_ORIGIN_REGEX"
          value = "https://.*\\.${local.escaped_domain}"
        },
        {
          name  = "SERVER_SESSION_COOKIE_DOMAIN"
          value = ".${var.domain_name}"
        },
        {
          name  = "SERVER_SESSION_COOKIE_SECURE"
          value = "True"
        },
        {
          name  = "SERVER_EMAIl_PROVIDER"
          value = var.environment_name == "staging" ? "dummy" : "aws_ses"
        },

        {
          name  = "SERVER_EMAIL_FROM"
          value = aws_ses_email_identity.this.email
        },
        {
          name  = "SERVER_S3_BUCKET_NAME"
          value = aws_s3_bucket.this.bucket
        },
        {
          name  = "SERVER_ACCOUNTS_BASE_URL"
          value = "https://accounts.${var.domain_name}"
        },
        {
          name  = "SERVER_RECRUITER_PORTAL_BASE_URL"
          value = "https://recruiter.${var.domain_name}"
        },
        {
          name  = "SERVER_SEEKER_PORTAL_BASE_URL"
          value = "https://${var.domain_name}"
        },
        {
          name  = "SERVER_RP_ID"
          value = var.domain_name
        },
        {
          name  = "SERVER_RP_NAME"
          value = var.app_name
        },
        {
          name  = "SERVER_RP_EXPECTED_ORIGIN"
          value = "https://accounts.${var.domain_name}"
        },
        {
          name  = "SERVER_SENTRY_DSN"
          value = var.sentry_backend_dsn
        },
        {
          name  = "SERVER_PERSISTED_QUERIES_PATH"
          value = "query_map.json"
        },
        {
          name  = "SERVER_REDIS_HOST"
          value = tostring(local.redis_host)
        },
        {
          name  = "SERVER_REDIS_PORT"
          value = tostring(local.redis_port)
        },
        {
          name  = "SERVER_REDIS_USERNAME"
          value = "default"
        },
        {
          name  = "SERVER_REDIS_SSL"
          value = "True"
        },
        {
          name  = "SERVER_SQS_QUEUE_URL"
          value = aws_sqs_queue.this.url
        },
        {
          name  = "AWS_SECRETS_MANAGER_SECRET_ID"
          value = aws_secretsmanager_secret.backend.id
        },
        {
          name  = "SERVER_WHATSAPP_PHONE_NUMBER_ID"
          value = var.whatsapp_phone_number_id
        },
        {
          name  = "SERVER_POSTHOG_API_HOST"
          value = var.posthog_api_host
        }
      ], local.staging_env_vars)
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "${var.resource_prefix}-app-service"
  cluster         = aws_ecs_cluster.ecs.id
  task_definition = aws_ecs_task_definition.app.arn
  # uncomment this out while changing the capacity provider
  # launch_type                        = "EC2"
  desired_count                      = var.environment_name == "staging" ? 0 : 1
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  tags = {
    Environment = var.environment_name
  }

  # comment this out while changing the capacity provider
  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.asg_capacity_provider.name
    weight            = 1
  }

  # Connect to the ALB target group
  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_new_tg.arn
    container_name   = "my-app"
    container_port   = 8000
  }

  deployment_controller {
    type = "ECS"
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  depends_on = [aws_lb_listener.https, aws_lb_target_group.ecs_new_tg]
}
