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
      #   BOTO3_REGION         = var.region
      #   BOTO3_S3_BUCKET_NAME = aws_s3_bucket.this.id
      #   DEBUG                = "False"
      #   CLOUD_PLATFORM       = "aws"
      #   APP_OPENAPI_URL      = "/openapi.json"
      SERVER_HOST = "0.0.0.0"
      SERVER_PORT = "8000"
      #   LOGGING_LEVEL        = "info"
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
