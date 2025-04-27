resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/api-gateway/${aws_api_gateway_rest_api.this.name}"
  retention_in_days = 14
}
