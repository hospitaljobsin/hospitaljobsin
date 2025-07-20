resource "aws_lb" "ecs_alb" {
  name               = "${var.resource_prefix}-ecs-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.default.ids
  security_groups    = [aws_security_group.ecs_sg.id]
}

# resource "aws_lb_target_group" "ecs_tg" {
#   name     = "${var.resource_prefix}-ecs-tg"
#   port     = 80
#   protocol = "HTTP"
#   vpc_id   = data.aws_vpc.default.id

#   health_check {
#     path                = "/health/"
#     interval            = 30
#     timeout             = 5
#     healthy_threshold   = 2
#     unhealthy_threshold = 2
#     matcher             = "200-399"
#   }
# }

resource "aws_lb_target_group" "ecs_new_tg" {
  name        = "${var.resource_prefix}-ecs-new-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "instance"

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}



resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate_validation.api_cert.certificate_arn

  depends_on = [aws_lb_target_group.ecs_new_tg]

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_new_tg.arn
  }
}
