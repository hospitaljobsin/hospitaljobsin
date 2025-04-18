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
  description = "Custom policy for Lambda to access S3, Textract, and Bedrock"

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
          "textract:DetectDocumentText",
          "textract:AnalyzeDocument",
          "textract:GetDocumentTextDetection"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "bedrock:*"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "dynamodb:*"
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
    subnet_ids         = aws_subnet.private.*.id        # Use private subnets here
    security_group_ids = [aws_security_group.lambda.id] # Security group for Lambda
  }

  environment {
    variables = {
      SERVER_DEBUG                     = "false"
      SERVER_ENVIRONMENT               = "development"
      test                             = mongodbatlas_database_user.user.auth_database_name
      DATABASE_URL                     = "mongodb://${mongodbatlas_database_user.user.username}:${mongodbatlas_database_user.user.password}@localhost:27017/${mongodbatlas_database_user.user.auth_database_name}"
      SERVER_DATABASE_URL              = "mongodb://user:pass@localhost:27017/medical_jobs"
      SERVER_HOST                      = "0.0.0.0"
      SERVER_PORT                      = "8000"
      SERVER_LOG_LEVEL                 = "INFO"
      SERVER_CORS_ALLOW_ORIGINS        = ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5001", "http://127.0.0.1:5001", "http://localhost:5002", "http://127.0.0.1:5002"]
      SERVER_GOOGLE_CLIENT_ID          = "54903425274-ru25bg9cvfrbsms789vcse41sdpe0ku0.apps.googleusercontent.com"
      SERVER_GOOGLE_CLIENT_SECRET      = "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"
      SERVER_EMAIL_HOST                = "localhost"
      SERVER_EMAIL_PORT                = "1025"
      SERVER_EMAIL_USERNAME            = ""
      SERVER_EMAIL_PASSWORD            = ""
      SERVER_EMAIL_FROM                = "noreply@example.com"
      SERVER_APP_URL                   = "http://localhost:3000"
      SERVER_RECAPTCHA_SECRET_KEY      = "6LfYvMQqAAAAAE4n1S3dCQAmJoyfIaufnRJ4EXBy"
      SERVER_S3_BUCKET_NAME            = "medicaljobs"
      SERVER_ACCOUNTS_BASE_URL         = "http://localhost:5002"
      SERVER_RECRUITER_PORTAL_BASE_URL = "http://localhost:5001"
      SERVER_RP_ID                     = "localhost"
      SERVER_RP_NAME                   = "Starter"
      SERVER_RP_EXPECTED_ORIGIN        = "http://localhost:5002"
      SERVER_JWE_SECRET_KEY            = "ca07d5f965a534ffb07d1699e30385a6"
      SERVER_AWS_ENDPOINT_URL          = "http://localhost:9000"
      SERVER_AWS_SECRET_ACCESS_KEY     = "minio-secret-key"
      SERVER_AWS_ACCESS_KEY_ID         = "minio-access-key"
      SERVER_GEOCODER_DOMAIN           = "localhost:8080"
      SERVER_GEOCODER_USER_AGENT       = "medical-jobs-server"
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
