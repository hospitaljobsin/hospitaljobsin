resource "aws_cloudwatch_log_group" "ecs_app" {
  name              = "/ecs/${var.resource_prefix}-app"
  retention_in_days = 7
  tags = {
    Environment = var.environment_name
  }
}
