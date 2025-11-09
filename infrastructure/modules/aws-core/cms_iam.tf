# IAM Roles
resource "aws_iam_role" "cms_exec_role" {
  name = "${var.resource_prefix}-lambda-cms-execution-role"

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


# Inline Policies for MongoDB AWS Auth
resource "aws_iam_role_policy" "lambda_worker_mongodb_aws_auth" {
  name = "${var.resource_prefix}-mongodb-aws-auth-cms"
  role = aws_iam_role.cms_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["sts:AssumeRole", "sts:GetCallerIdentity"],
      Resource = "*"
    }]
  })
}

# Inline Policy for S3 Bucket Access
resource "aws_iam_role_policy" "lambda_cms_s3_access" {
  name = "${var.resource_prefix}-s3-access-cms"
  role = aws_iam_role.cms_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetObjectVersion",
          "s3:PutObjectAcl"
        ],
        Resource = [
          aws_s3_bucket.cms.arn,
          "${aws_s3_bucket.cms.arn}/*"
        ]
      }
    ]
  })
}

# Policy Attachments - Worker Role
resource "aws_iam_role_policy_attachment" "lambda_cms_exec_policy" {
  role       = aws_iam_role.cms_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_cms_vpc_access_policy" {
  role       = aws_iam_role.cms_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
