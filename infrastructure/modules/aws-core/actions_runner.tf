# Security Group for GitHub Actions Runner
resource "aws_security_group" "actions_runner" {
  name_prefix = "${var.resource_prefix}-actions-runner-"
  description = "Security group for GitHub Actions runner in public subnet"
  vpc_id      = var.vpc_id

  # Allow outbound internet access (required for GitHub API calls and package downloads)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  # Allow inbound SSH access (for debugging and maintenance)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow SSH access for debugging"
  }

  # Allow inbound HTTP access (if runner needs to serve webhooks or health checks)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP access for webhooks and health checks"
  }

  # Allow inbound HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS access for secure webhooks"
  }

  # Allow inbound traffic from VPC CIDR for internal communication
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [data.aws_vpc.main.cidr_block]
    description = "Allow all traffic from within VPC"
  }

  tags = {
    Name        = "${var.resource_prefix}-actions-runner-sg"
    Environment = var.environment_name
    Purpose     = "GitHub Actions Runner Security Group"
  }
}

# IAM Role for GitHub Actions Runner
resource "aws_iam_role" "actions_runner" {
  name = "${var.resource_prefix}-actions-runner-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.resource_prefix}-actions-runner-role"
    Environment = var.environment_name
    Purpose     = "GitHub Actions Runner IAM Role"
  }
}

# IAM Policy for GitHub Actions Runner
resource "aws_iam_policy" "actions_runner" {
  name        = "${var.resource_prefix}-actions-runner-policy"
  description = "Policy for GitHub Actions runner to access necessary AWS services"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:GetRepositoryPolicy",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:BatchDeleteImage",
          "ecr:GetLifecyclePolicy",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:ListTagsForResource",
          "ecr:DescribeImageScanFindings"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          "arn:aws:s3:::${var.resource_prefix}-*",
          "arn:aws:s3:::${var.resource_prefix}-*/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:${var.resource_prefix}-*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${var.resource_prefix}-*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.aws_region}.amazonaws.com"
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeSubnets",
          "ec2:DescribeVpcs",
          "ec2:DescribeAvailabilityZones"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:PassRole"
        ]
        Resource = aws_iam_role.actions_runner.arn
        Condition = {
          StringEquals = {
            "iam:PassedToService" = "ec2.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.resource_prefix}-actions-runner-policy"
    Environment = var.environment_name
    Purpose     = "GitHub Actions Runner IAM Policy"
  }
}

# Attach the policy to the role
resource "aws_iam_role_policy_attachment" "actions_runner" {
  role       = aws_iam_role.actions_runner.name
  policy_arn = aws_iam_policy.actions_runner.arn
}

# Instance Profile for the runner
resource "aws_iam_instance_profile" "actions_runner" {
  name = "${var.resource_prefix}-actions-runner-profile"
  role = aws_iam_role.actions_runner.name

  tags = {
    Name        = "${var.resource_prefix}-actions-runner-profile"
    Environment = var.environment_name
    Purpose     = "GitHub Actions Runner Instance Profile"
  }
}
