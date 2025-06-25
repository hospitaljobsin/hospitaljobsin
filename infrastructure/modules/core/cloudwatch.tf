resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/api-gateway/${aws_apigatewayv2_api.this.name}"
  retention_in_days = 14
}
