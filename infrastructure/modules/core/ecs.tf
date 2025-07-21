# Escape every '.' in the domain_name to '\.'; Terraform needs "\\." to emit a literal "\\."
locals {
  # "\\\." in HCL ⇒ produces a single "\." in the rendered value
  escaped_domain = replace(var.domain_name, ".", "\\.")
  redis_parts    = split(":", var.redis_endpoint)
  redis_host     = element(local.redis_parts, 0)
  redis_port     = tonumber(element(local.redis_parts, 1))
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "map-public-ip-on-launch"
    values = [true]
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
  name = "ecs_task_execution_role"

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
  name = "ecs_task_custom_policy"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = aws_iam_policy.lambda_custom_policy.policy
}

resource "aws_iam_role_policy" "ecs_mongodb_aws_auth" {
  name = "mongodb_aws_auth_ecs"
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
  name = "ecs-instance-role"

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
  name   = "${var.resource_prefix}-alb-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    description = "Allow HTTPS traffic from the internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_security_group" "ecs_sg" {
  name   = "ecs-ec2-sg"
  vpc_id = data.aws_vpc.default.id
}

resource "aws_security_group_rule" "ingress_docker_ports" {
  type              = "ingress"
  from_port         = 32768
  to_port           = 61000
  protocol          = "-1"
  cidr_blocks       = [data.aws_vpc.default.cidr_block]
  security_group_id = aws_security_group.ecs_sg.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
  security_group_id = aws_security_group.ecs_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  #   cidr_ipv6         = "::/0"
  from_port   = 22
  ip_protocol = "tcp"
  to_port     = 22
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


# TODO: split the container (ecs) and alb security groups later

resource "aws_vpc_security_group_ingress_rule" "allow_alb_to_ecs_8000" {
  description                  = "Allow ALB to reach ECS on port 8000"
  security_group_id            = aws_security_group.ecs_sg.id
  referenced_security_group_id = aws_security_group.alb_sg.id
  from_port                    = 8000
  to_port                      = 8000
  ip_protocol                  = "tcp"
}


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


resource "aws_ec2_capacity_reservation" "ecs" {
  instance_type     = "t3a.medium" # match your ASG/Launch Template
  instance_platform = "Linux/UNIX"
  availability_zone = "us-east-1a"
  instance_count    = 1 # number of instances to reserve
  ebs_optimized     = true
  tenancy           = "default"
}



resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "${var.resource_prefix}-ecs-launch-template-"
  image_id      = data.aws_ami.ecs_optimized.id
  instance_type = "t3a.medium"

  key_name = "ec2-debug"

  capacity_reservation_specification {
    capacity_reservation_target {
      capacity_reservation_id = aws_ec2_capacity_reservation.ecs.id
    }
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  network_interfaces {
    associate_public_ip_address = true
    device_index                = 0
    security_groups             = [aws_security_group.ecs_sg.id]
    subnet_id                   = element(data.aws_subnets.default.ids, 0)
  }

  #   vpc_security_group_ids = [aws_security_group.ecs_sg.id]

  user_data = base64encode(<<EOF
#!/bin/bash
echo "ECS_CLUSTER=${aws_ecs_cluster.ecs.name}" >> /etc/ecs/ecs.config
EOF
  )
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "${var.resource_prefix}-ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_autoscaling_group" "ecs_asg" {
  protect_from_scale_in     = true
  name                      = "${var.resource_prefix}-asg-ecs"
  desired_capacity          = 1
  max_size                  = 1
  min_size                  = 1
  vpc_zone_identifier       = data.aws_subnets.default.ids
  health_check_type         = "EC2"
  health_check_grace_period = 30

  launch_template {
    id      = aws_launch_template.ecs_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "ecs-instance"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_ecs_capacity_provider" "asg_capacity_provider" {
  name = "${var.resource_prefix}-ecs-capacity-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.ecs_asg.arn
    managed_termination_protection = "ENABLED"

    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = 100
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 1
      instance_warmup_period    = 300
    }
  }

  lifecycle {
    create_before_destroy = true
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
  name = "ecs-ec2-default-cluster"
}


resource "aws_ecs_task_definition" "app" {
  family                   = "${var.resource_prefix}-app-task"
  requires_compatibilities = ["EC2"]
  network_mode             = "bridge" # or "host"
  cpu                      = "1024"
  memory                   = "1024"

  task_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn


  container_definitions = jsonencode([
    {
      name      = "my-app"
      image     = "${aws_ecr_repository.backend.repository_url}:latest"
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
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = "/ecs/${var.resource_prefix}-app"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      },
      environment = [
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
          value = "production"
        },
        {
          name  = "SERVER_DATABASE_URL"
          value = "${mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv}?authMechanism=MONGODB-AWS&authSource=$external"
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
          value = "aws_ses"
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
          name  = "SERVER_GEOCODING_PROVIDER"
          value = "aws_location"
        },
        {
          name  = "SERVER_SINGLE_USE_LOCATION_PLACE_INDEX_NAME"
          value = aws_location_place_index.single_use.index_name
        },
        {
          name  = "SERVER_STORAGE_LOCATION_PLACE_INDEX_NAME"
          value = aws_location_place_index.storage.index_name
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
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "${var.resource_prefix}-app-service"
  cluster         = aws_ecs_cluster.ecs.id
  task_definition = aws_ecs_task_definition.app.arn
  #   launch_type                        = "EC2"
  desired_count                      = 1
  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 200

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

  depends_on = [aws_lb_listener.https, aws_lb_target_group.ecs_new_tg]
}
