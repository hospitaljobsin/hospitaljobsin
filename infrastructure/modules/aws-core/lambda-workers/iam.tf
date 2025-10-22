# IAM Roles
resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.resource_prefix}-lambda-execution-role"

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

resource "aws_iam_role" "lambda_worker_exec_role" {
  name = "${var.resource_prefix}-lambda-worker-exec-role"

  tags = {
    Environment = var.environment_name
  }

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role" "lambda_staging_db_exec_role" {
  name = "${var.resource_prefix}-lambda-staging-db-exec-role"

  tags = {
    Environment = var.environment_name
  }

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role" "lambda_job_alerts_exec_role" {
  name = "${var.resource_prefix}-lambda-job-alerts-exec-role"

  tags = {
    Environment = var.environment_name
  }

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

# IAM Policies
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
          var.s3_bucket_arn,
          "${var.s3_bucket_arn}/*"
        ]
      },
      {
        Effect   = "Allow",
        Action   = ["ses:SendEmail", "ses:SendRawEmail"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["secretsmanager:GetSecretValue"],
        Resource = "*"
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
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:CreateModelInvocationJob"
        ],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["sqs:SendMessage"],
        Resource = [var.sqs_queue_arn, "${var.sqs_queue_arn}/*"]
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
        Resource = [var.sqs_queue_arn, "${var.sqs_queue_arn}/*"]
      },
      {
        Effect = "Allow",
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:CreateModelInvocationJob"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_job_alerts_policy" {
  name        = "${var.resource_prefix}-lambda-job-alerts-policy"
  description = "Custom policy for Lambda to access job alerts SQS queue"

  tags = {
    Environment = var.environment_name
  }

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "sqs:SendMessage",
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      Resource = [var.sqs_job_alerts_queue_arn, "${var.sqs_job_alerts_queue_arn}/*"]
    }]
  })
}

# Inline Policies for MongoDB AWS Auth
resource "aws_iam_role_policy" "lambda_worker_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth-worker"
  role = aws_iam_role.lambda_worker_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["sts:AssumeRole", "sts:GetCallerIdentity"],
      Resource = "*"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_staging_db_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth-staging-db"
  role = aws_iam_role.lambda_staging_db_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["sts:AssumeRole", "sts:GetCallerIdentity"],
      Resource = "*"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_job_alerts_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth-job-alerts"
  role = aws_iam_role.lambda_job_alerts_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["sts:AssumeRole", "sts:GetCallerIdentity"],
      Resource = "*"
    }]
  })
}

# Policy Attachments - Worker Role
resource "aws_iam_role_policy_attachment" "lambda_worker_exec_policy" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_worker_vpc_access_policy" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_worker_custom_policy_attachment" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_worker_custom_sqs_policy_attachment" {
  role       = aws_iam_role.lambda_worker_exec_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy_worker.arn
}

# Policy Attachments - Staging DB Role
resource "aws_iam_role_policy_attachment" "lambda_staging_db_exec_policy" {
  role       = aws_iam_role.lambda_staging_db_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_staging_db_vpc_access_policy" {
  role       = aws_iam_role.lambda_staging_db_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Policy Attachments - Job Alerts Role
resource "aws_iam_role_policy_attachment" "lambda_job_alerts_exec_policy" {
  role       = aws_iam_role.lambda_job_alerts_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_job_alerts_vpc_access_policy" {
  role       = aws_iam_role.lambda_job_alerts_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_job_alerts_custom_policy_attachment" {
  role       = aws_iam_role.lambda_job_alerts_exec_role.name
  policy_arn = aws_iam_policy.lambda_custom_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_job_alerts_sqs_policy_attachment" {
  role       = aws_iam_role.lambda_job_alerts_exec_role.name
  policy_arn = aws_iam_policy.lambda_job_alerts_policy.arn
}
