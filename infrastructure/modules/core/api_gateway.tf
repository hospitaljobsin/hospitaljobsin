resource "aws_api_gateway_rest_api" "this" {
  name        = "${var.resource_prefix}-api-gateway"
  description = "API Gateway for ${var.app_name} backend"
}


# Deployment of API Gateway
resource "aws_api_gateway_deployment" "this" {
  depends_on = [
    aws_api_gateway_integration.lambda,
  ]

  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.lambda.id,
      aws_api_gateway_method.proxy.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
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


resource "aws_api_gateway_stage" "production" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  deployment_id = aws_api_gateway_deployment.this.id
  stage_name    = "production"

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format          = "$context.requestId $context.identity.sourceIp $context.identity.caller $context.identity.user $context.requestTime $context.httpMethod $context.resourcePath $context.status $context.protocol $context.responseLength"
  }

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


# data "aws_cloudfront_cache_policy" "disabled" {
#   name = "Managed-CachingDisabled"
# }

# resource "aws_cloudfront_origin_request_policy" "api_policy" {
#   name = "forward-origin-and-cookies"

#   cookies_config {
#     cookie_behavior = "all" # Or "whitelist" and list names below
#   }

#   headers_config {
#     header_behavior = "allViewer"
#     # headers {
#     #   items = ["*"]
#     # }
#   }

#   query_strings_config {
#     query_string_behavior = "all"
#   }
# }


# resource "aws_cloudfront_distribution" "api" {
#   enabled             = true
#   default_root_object = ""
#   aliases             = ["api.${var.domain_name}"]

#   origin {
#     domain_name = aws_api_gateway_domain_name.custom.cloudfront_domain_name
#     origin_id   = "api-gateway-origin"

#     custom_origin_config {
#       origin_protocol_policy = "https-only"
#       http_port              = 80
#       https_port             = 443
#       origin_ssl_protocols   = ["TLSv1.2"]
#     }
#   }

#   default_cache_behavior {
#     allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = "api-gateway-origin"

#     viewer_protocol_policy   = "redirect-to-https"
#     origin_request_policy_id = aws_cloudfront_origin_request_policy.api_policy.id
#     cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
#   }

#   viewer_certificate {
#     acm_certificate_arn      = aws_acm_certificate_validation.api_cert.certificate_arn
#     ssl_support_method       = "sni-only"
#     minimum_protocol_version = "TLSv1.2_2019"
#   }

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

# }
