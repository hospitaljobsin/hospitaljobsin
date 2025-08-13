resource "aws_s3_bucket" "lb_logs" {
  bucket_prefix = "${var.resource_prefix}-lb"
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_s3_bucket_policy" "lb_logs_policy" {
  bucket = aws_s3_bucket.lb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "logdelivery.elasticloadbalancing.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.lb_logs.arn}/alb/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "logdelivery.elasticloadbalancing.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.lb_logs.arn
      }
    ]
  })
}


resource "aws_lb" "ecs_alb" {
  name               = "${var.resource_prefix}-ecs-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.public.ids
  # security_groups                  = [aws_security_group.alb_sg.id] # TODO: uncomment later
  enable_cross_zone_load_balancing = true
  enable_http2                     = true

  tags = {
    Environment = var.environment_name
  }

  access_logs {
    enabled = true
    prefix  = "alb"
    bucket  = aws_s3_bucket.lb_logs.bucket
  }

  depends_on = [aws_security_group.alb_sg]
}

resource "aws_lb_target_group" "ecs_new_tg" {
  name        = "${var.resource_prefix}-backend-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance" # instead of "ip"

  tags = {
    Environment = var.environment_name
  }


  health_check {
    path                = "/health/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate_validation.api_cert.certificate_arn

  depends_on = [aws_lb_target_group.ecs_new_tg]

  tags = {
    Environment = var.environment_name
  }

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_new_tg.arn
  }
}
