# Lambda Execution Role


resource "aws_iam_role" "lambda_worker_exec_role" {
  name = "${var.resource_prefix}-lambda-worker-exec-role"

  tags = {
    Environment = var.environment_name
  }

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

resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.resource_prefix}-lambda-exec-role"

  tags = {
    Environment = var.environment_name
  }

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
  name        = "${var.resource_prefix}-lambda-exec-custom-policy"
  description = "Custom policy for Lambda to access S3, Location and SES"

  tags = {
    Environment = var.environment_name
  }

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
          # "geo:SearchPlaceIndexForSuggestions",
        ],
        Resource = [
          aws_location_place_index.single_use.index_arn,
          aws_location_place_index.storage.index_arn
        ]
      },
      {
        Effect = "Allow",
        Action = ["secretsmanager:GetSecretValue"],
        Resource = [
          # aws_secretsmanager_secret.backend.arn,
          # "${aws_secretsmanager_secret.backend.arn}/*"
          "*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "textract:DetectDocumentText",
          "textract:AnalyzeDocument",
          "textract:GetDocumentTextDetection",
          "textract:StartDocumentAnalysis",
          "textract:GetDocumentAnalysis"
        ],
        Resource = [
          "*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:CreateModelInvocationJob"
        ],
        Resource = [
          "*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "sqs:SendMessage"
        ],
        Resource = [
          aws_sqs_queue.this.arn,
          "${aws_sqs_queue.this.arn}/*"
        ]
      }
    ]
  })
}


resource "aws_iam_policy" "lambda_custom_policy_worker" {
  name        = "${var.resource_prefix}-lambda-exec-custom-policy-worker"
  description = "Custom policy for Lambda to access SQS"

  tags = {
    Environment = var.environment_name
  }

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = [
          aws_sqs_queue.this.arn,
          "${aws_sqs_queue.this.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:CreateModelInvocationJob"
        ],
        Resource = [
          "*"
        ]
      },
    ]
  })
}

# Add this inline policy to your lambda role
resource "aws_iam_role_policy" "lambda_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth"
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

resource "aws_iam_role_policy" "lambda_worker_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth-worker"
  role = aws_iam_role.lambda_worker_exec_role.id



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


resource "aws_iam_role_policy_attachment" "lambda_worker_exec_policy" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_worker_vpc_access_policy" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Attach the custom policy to allow access to S3, Textract, and Bedrock

resource "aws_iam_role_policy_attachment" "lambda_worker_custom_policy_attachment" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy.arn
}
resource "aws_iam_role_policy_attachment" "lambda_worker_custom_sqs_policy_attachment" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy_worker.arn
}


resource "aws_lambda_function" "worker" {
  # depends_on    = [docker_registry_image.backend]
  function_name = "${var.resource_prefix}-worker-lambda"

  tags = {
    Environment = var.environment_name
  }


  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["app.sqs_handler.lambda_handler"]
  }

  # dead_letter_config {
  #   target_arn = aws_sqs_queue.this.arn
  # }

  publish = true

  # VPC Configuration - uncomment this while moving to private subnets
  # vpc_config {
  #   subnet_ids         = values(aws_subnet.private)[*].id
  #   security_group_ids = [aws_security_group.lambda.id] # Security group for Lambda
  # }

  environment {
    variables = {
      SERVER_DEBUG                                = "False"
      SERVER_ENVIRONMENT                          = "production"
      SERVER_DATABASE_URL                         = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME                = var.mongodb_database_name
      SERVER_HOST                                 = "0.0.0.0"
      SERVER_PORT                                 = "8000"
      SERVER_LOG_LEVEL                            = "DEBUG"
      SERVER_CORS_ALLOW_ORIGINS                   = "[\"https://${var.domain_name}\", \"https://recruiter.${var.domain_name}\", \"https://accounts.${var.domain_name}\"]"
      SERVER_CORS_ALLOW_ORIGIN_REGEX              = "https://.*\\.${local.escaped_domain}"
      SERVER_SESSION_COOKIE_DOMAIN                = ".${var.domain_name}"
      SERVER_SESSION_COOKIE_SECURE                = "True"
      SERVER_EMAIl_PROVIDER                       = "aws_ses"
      SERVER_EMAIL_FROM                           = aws_ses_email_identity.this.email
      SERVER_S3_BUCKET_NAME                       = aws_s3_bucket.this.bucket
      SERVER_ACCOUNTS_BASE_URL                    = "https://accounts.${var.domain_name}"
      SERVER_RECRUITER_PORTAL_BASE_URL            = "https://recruiter.${var.domain_name}"
      SERVER_SEEKER_PORTAL_BASE_URL               = "https://${var.domain_name}"
      SERVER_RP_ID                                = var.domain_name
      SERVER_RP_NAME                              = var.app_name
      SERVER_RP_EXPECTED_ORIGIN                   = "https://accounts.${var.domain_name}"
      SERVER_GEOCODING_PROVIDER                   = "aws_location"
      SERVER_SINGLE_USE_LOCATION_PLACE_INDEX_NAME = aws_location_place_index.single_use.index_name
      SERVER_STORAGE_LOCATION_PLACE_INDEX_NAME    = aws_location_place_index.storage.index_name
      SERVER_SENTRY_DSN                           = var.sentry_backend_dsn
      SERVER_PERSISTED_QUERIES_PATH               = "query_map.json"
      SERVER_REDIS_HOST                           = local.redis_host
      SERVER_REDIS_PORT                           = local.redis_port
      SERVER_REDIS_USERNAME                       = "default"
      SERVER_REDIS_SSL                            = "True"
      SERVER_SQS_QUEUE_URL                        = aws_sqs_queue.this.url

      AWS_SECRETS_MANAGER_SECRET_ID = aws_secretsmanager_secret.backend.id
    }
  }

  memory_size = 4096 # 2048
  timeout     = 60
}

resource "aws_lambda_event_source_mapping" "worker" {
  event_source_arn = aws_sqs_queue.this.arn
  function_name    = aws_lambda_function.worker.arn
  batch_size       = 10

  tags = {
    Environment = var.environment_name
  }

  scaling_config {
    maximum_concurrency = 25
  }
}



# Security Group for Lambda in Private Subnets
# Security Group for Lambda in Private Subnets
resource "aws_security_group" "lambda" {
  name   = "${var.resource_prefix}-lambda-sg"
  vpc_id = var.vpc_id

  tags = {
    Environment = var.environment_name
  }

  # Allow outbound traffic to the internet through NAT for external services (S3, Textract)
  # For IPv6, allow outbound to the internet (::/0) as well
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  # Ingress rules (if needed) for access from specific sources, like ECS or API Gateway
  # Example: Allow access from VPC internal IPs
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"] # Replace with VPC CIDR block
    # Allow IPv6 from VPC IPv6 range
    ipv6_cidr_blocks = ["::/0"] # Replace with your VPC's IPv6 CIDR
  }
}



resource "aws_lambda_function" "staging_database_setup" {
  # depends_on    = [docker_registry_image.backend]
  count         = var.environment_name == "staging" ? 1 : 0
  function_name = "${var.resource_prefix}-staging-database-setup-lambda"

  tags = {
    Environment = var.environment_name
  }


  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.setup_staging_database.lambda_handler"]
  }

  publish = true

  # VPC Configuration - uncomment this while moving to private subnets
  # vpc_config {
  #   subnet_ids         = values(aws_subnet.private)[*].id
  #   security_group_ids = [aws_security_group.lambda.id] # Security group for Lambda
  # }

  environment {
    variables = {
      SERVER_DEBUG                 = "False"
      SERVER_ENVIRONMENT           = "production"
      SERVER_DATABASE_URL          = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME = var.mongodb_database_name
      SERVER_LOG_LEVEL             = "DEBUG"
    }
  }

  memory_size = 1024
  timeout     = 60
}


resource "aws_lambda_function" "staging_database_teardown" {
  # depends_on    = [docker_registry_image.backend]
  count         = var.environment_name == "staging" ? 1 : 0
  function_name = "${var.resource_prefix}-staging-database-teardown-lambda"

  tags = {
    Environment = var.environment_name
  }


  role         = aws_iam_role.lambda_worker_exec_role.arn
  package_type = "Image"
  image_uri    = "${var.aws_lambda_worker_repository_url}:${var.environment_name}-latest"

  image_config {
    command = ["lambda_handlers.teardown_staging_database.lambda_handler"]
  }

  publish = true

  # VPC Configuration - uncomment this while moving to private subnets
  # vpc_config {
  #   subnet_ids         = values(aws_subnet.private)[*].id
  #   security_group_ids = [aws_security_group.lambda.id] # Security group for Lambda
  # }

  environment {
    variables = {
      SERVER_DEBUG                 = "False"
      SERVER_ENVIRONMENT           = "production"
      SERVER_DATABASE_URL          = "${var.mongodb_connection_string}?authMechanism=MONGODB-AWS&authSource=$external"
      SERVER_DEFAULT_DATABASE_NAME = var.mongodb_database_name
      SERVER_LOG_LEVEL             = "DEBUG"
    }
  }

  memory_size = 1024
  timeout     = 60
}
