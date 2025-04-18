
# Lambda Execution Role
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}


# Custom policy to allow access to S3, Textract, and Bedrock
resource "aws_iam_policy" "lambda_custom_policy" {
  name        = "lambda_exec_custom_policy"
  description = "Custom policy for Lambda to access S3, Location and SES"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject"
        ],
        Resource = [
          aws_s3_bucket.this.arn,
          "${aws_s3_bucket.this.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
          # optionally:
          # "ses:SendTemplatedEmail"
        ],
        Resource = "*"
        # Optional: restrict to verified identity
        # Resource = "arn:aws:ses:<region>:<account-id>:identity/noreply@hospitaljobs.in"
      },
      {
        Effect = "Allow",
        Action = [
          "geo:SearchPlaceIndexForText",
          "geo:SearchPlaceIndexForPosition",
        ],
        Resource = [
          aws_location_place_index.this.index_arn
        ]
      }
    ]
  })
}

# Add this inline policy to your lambda role
resource "aws_iam_role_policy" "lambda_mongodb_aws_auth" {
  name = "mongodb_aws_auth"
  role = aws_iam_role.lambda_exec_role.id

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


# Attach AWS-managed policies for Lambda execution, logging, and VPC access
resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access_policy" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Attach the custom policy to allow access to S3, Textract, and Bedrock
resource "aws_iam_role_policy_attachment" "lambda_custom_policy_attachment" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy.arn
}


# Lambda Function in Private Subnets
resource "aws_lambda_function" "backend" {
  function_name = "${var.resource_prefix}-backend-lambda"

  role         = aws_iam_role.lambda_exec_role.arn
  package_type = "Image"
  image_uri    = "${aws_ecr_repository.backend.repository_url}:latest"

  publish = true

  # VPC Configuration
  vpc_config {
    subnet_ids         = values(aws_subnet.private)[*].id # Use private subnets here
    security_group_ids = [aws_security_group.lambda.id]   # Security group for Lambda
  }

  environment {
    variables = {
      SERVER_DEBUG                 = "false"
      SERVER_ENVIRONMENT           = "production"
      SERVER_DATABASE_URL          = "${mongodbatlas_advanced_cluster.this.connection_strings.0.standard_srv}?authMechanism=MONGODB-AWS"
      SERVER_DEFAULT_DATABASE_NAME = var.mongodb_database_name
      SERVER_HOST                  = "0.0.0.0"
      SERVER_PORT                  = "8000"
      SERVER_LOG_LEVEL             = "INFO"
      SERVER_CORS_ALLOW_ORIGINS    = "[\"http://localhost:5000\", \"http://localhost:5001\", \"http://localhost:5002\"]"
      SERVER_GOOGLE_CLIENT_ID      = "XXX"
      SERVER_GOOGLE_CLIENT_SECRET  = "XXX"
      SERVER_EMAIl_PROVIDER        = "aws_ses"
      SERVER_EMAIL_FROM            = aws_ses_email_identity.this.email
      # TODO: pass ARN and fetch from Secrets Manager
      SERVER_RECAPTCHA_SECRET_KEY      = "XXX"
      SERVER_S3_BUCKET_NAME            = aws_s3_bucket.this.bucket
      SERVER_ACCOUNTS_BASE_URL         = "https://accounts.${var.domain_name}"
      SERVER_RECRUITER_PORTAL_BASE_URL = "https://recruiter.${var.domain_name}"
      SERVER_SEEKER_PORTAL_BASE_URL    = "https://${var.domain_name}"
      SERVER_RP_ID                     = var.domain_name
      SERVER_RP_NAME                   = var.app_name
      SERVER_RP_EXPECTED_ORIGIN        = "https://accounts.${var.domain_name}"
      # TODO: pass ARN and fetch from Secrets Manager
      SERVER_JWE_SECRET_KEY            = "ca07d5f965a534ffb07d1699e30385a6"
      SERVER_GEOCODING_PROVIDER        = "aws_location"
      SERVER_LOCATION_PLACE_INDEX_NAME = aws_location_place_index.this.index_name
    }
  }

  memory_size = 2048
  timeout     = 60
}

resource "aws_lambda_provisioned_concurrency_config" "backend" {
  function_name                     = aws_lambda_function.backend.function_name
  provisioned_concurrent_executions = 1
  qualifier                         = aws_lambda_function.backend.version
}

# Security Group for Lambda in Private Subnets
resource "aws_security_group" "lambda" {
  name   = "${var.resource_prefix}-lambda-sg"
  vpc_id = aws_vpc.this.id

  # Allow outbound traffic to the internet through NAT for external services (S3, Textract)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Ingress rules (if needed) for access from specific sources, like ECS or API Gateway
  # Example: Allow access from VPC internal IPs
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"] # Replace with VPC CIDR block
  }
}


resource "aws_lambda_permission" "backend" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}
