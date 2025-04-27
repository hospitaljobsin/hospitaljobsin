resource "aws_api_gateway_rest_api" "this" {
  name        = "${var.resource_prefix}-api-gateway"
  description = "API Gateway for ${var.app_name} backend"
}


# Deployment of API Gateway
resource "aws_api_gateway_deployment" "this" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.cors_options,
    aws_api_gateway_integration_response.cors_200,
  ]

  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.lambda.id,
      aws_api_gateway_integration.cors_options.id,
      aws_api_gateway_method.proxy.id,
      aws_api_gateway_method.proxy_options.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_api_gateway_stage" "production" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  deployment_id = aws_api_gateway_deployment.this.id
  stage_name    = "production"

  # Define the stage variable here
  # variables = {
  #   lambda_alias = "your_lambda_alias" # Replace with the actual alias you want to use
  # }
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "{proxy+}"
}

# Main API Method for ANY requests
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.backend.invoke_arn
}

# CORS OPTIONS Method
resource "aws_api_gateway_method" "proxy_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "OPTIONS"
  authorization = "NONE"
  request_parameters = {
    "method.request.header.Origin" = true
  }
}

# Integration for CORS OPTIONS Method
resource "aws_api_gateway_integration" "cors_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method

  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = <<EOF
        #set($domains = [
          "https://${var.domain_name}",
          "https://accounts.${var.domain_name}",
          "https://recruiter.${var.domain_name}",
        ])
        #set($origin = $input.params("origin"))
        #if($domains.contains($origin))
          #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)
        #end
        #set($context.responseOverride.header.Access-Control-Allow-Methods = "OPTIONS,GET,POST,PUT,PATCH,DELETE")
        #set($context.responseOverride.header.Access-Control-Allow-Headers = "Content-Type,Authorization,Cookie,Set-Cookie")
        #set($context.responseOverride.header.Access-Control-Allow-Credentials = "true")
        {
          "statusCode": 200
        }
      EOF
  }
}

# Integration Response for CORS OPTIONS Method
resource "aws_api_gateway_integration_response" "cors_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  status_code = aws_api_gateway_method_response.cors_200.status_code

  response_parameters = {
    # Empty because response headers are already overridden in template
  }

  depends_on = [
    aws_api_gateway_method_response.cors_200,
    aws_api_gateway_integration.cors_options
  ]
}

# Method Response for CORS OPTIONS Method
resource "aws_api_gateway_method_response" "cors_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true
    "method.response.header.Access-Control-Allow-Methods"     = true
    "method.response.header.Access-Control-Allow-Origin"      = true
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}


# Domain name mapping

resource "aws_api_gateway_domain_name" "custom" {
  domain_name     = "api.${var.domain_name}"
  certificate_arn = aws_acm_certificate_validation.api_cert.certificate_arn
}

resource "aws_api_gateway_base_path_mapping" "api" {
  api_id      = aws_api_gateway_rest_api.this.id
  stage_name  = aws_api_gateway_stage.production.stage_name
  domain_name = aws_api_gateway_domain_name.custom.domain_name
}
