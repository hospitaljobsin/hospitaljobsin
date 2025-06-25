resource "aws_apigatewayv2_api" "this" {
  name          = "${var.resource_prefix}-api-gateway"
  description   = "API Gateway for ${var.app_name} backend"
  protocol_type = "HTTP"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_apigatewayv2_deployment" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  description = "Deployment for ${var.app_name} backend"

  depends_on = [aws_apigatewayv2_route.lambda]


  triggers = {
    redeployment = sha1(jsonencode([
      aws_apigatewayv2_route.lambda,
      aws_apigatewayv2_integration.lambda,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_apigatewayv2_stage" "production" {
  api_id        = aws_apigatewayv2_api.this.id
  deployment_id = aws_apigatewayv2_deployment.this.id
  name          = "production"

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format          = "$context.requestId $context.identity.sourceIp $context.identity.caller $context.identity.user $context.requestTime $context.httpMethod $context.resourcePath $context.status $context.protocol $context.responseLength"
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.this.id
  integration_type = "AWS_PROXY"

  connection_type = "INTERNET"
  # content_handling_strategy = "CONVERT_TO_TEXT"
  description          = "Lambda backend"
  integration_method   = "POST"
  integration_uri      = aws_lambda_function.backend.invoke_arn
  passthrough_behavior = "WHEN_NO_MATCH"

  # request_parameters = {
  #   "method.request.header.Origin"        = true
  #   "method.request.header.Authorization" = true
  #   "method.request.header.Cookie"        = true
  #   "method.request.header.Content-Type"  = true

  #   "method.request.header.Access-Control-Request-Headers" = false
  #   "method.request.header.Access-Control-Request-Method"  = false
  # }

  request_parameters = {
    "overwrite:header.Origin"        = "$request.header.Origin"
    "overwrite:header.Authorization" = "$request.header.Authorization"
    "overwrite:header.Cookie"        = "$request.header.Cookie"
    "overwrite:header.Content-Type"  = "$request.header.Content-Type"

    # "overwrite:header.Access-Control-Request-Headers" = "$request.header.Access-Control-Request-Headers"
    # "overwrite:header.Access-Control-Request-Method"  = "$request.header.Access-Control-Request-Method"
  }
}

resource "aws_apigatewayv2_route" "lambda" {
  api_id = aws_apigatewayv2_api.this.id
  # route_key = "ANY /example/{proxy+}"
  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Domain name mapping

resource "aws_apigatewayv2_domain_name" "custom" {
  domain_name = "api.${var.domain_name}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api_cert.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.this.id
  domain_name = aws_apigatewayv2_domain_name.custom.id
  stage       = aws_apigatewayv2_stage.production.id
}


resource "aws_api_gateway_account" "this" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "cloudwatch" {
  name               = "api_gateway_cloudwatch_global"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "cloudwatch" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents",
    ]

    resources = ["*"]
  }
}
resource "aws_iam_role_policy" "cloudwatch" {
  name   = "default"
  role   = aws_iam_role.cloudwatch.id
  policy = data.aws_iam_policy_document.cloudwatch.json
}


# # TODO: create a resource for this
# resource "aws_api_gateway_resource" "proxy" {
#   rest_api_id = aws_api_gateway_rest_api.this.id
#   parent_id   = aws_api_gateway_rest_api.this.root_resource_id
#   path_part   = "{proxy+}"
# }

# # TODO: create a resource for this
# # Main API Method for ANY requests
# resource "aws_api_gateway_method" "proxy" {
#   rest_api_id   = aws_api_gateway_rest_api.this.id
#   resource_id   = aws_api_gateway_resource.proxy.id
#   http_method   = "ANY"
#   authorization = "NONE"

#   request_parameters = {
#     "method.request.header.Origin"        = true
#     "method.request.header.Authorization" = true
#     "method.request.header.Cookie"        = true
#     "method.request.header.Content-Type"  = true

#     "method.request.header.Access-Control-Request-Headers" = false
#     "method.request.header.Access-Control-Request-Method"  = false
#   }

# }
