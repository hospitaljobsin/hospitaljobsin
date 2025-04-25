# Create an IAM user for GitHub Actions
resource "aws_iam_user" "github_actions" {
  name = "github-actions-ecr-user-${data.github_repository.this.name}"
  path = "/system/"

  tags = {
    Terraform  = "true"
    Repository = data.github_repository.this.name
  }
}

# Define an IAM policy for ECR access needed by GitHub Actions
resource "aws_iam_policy" "github_actions" {
  name        = "github-actions-policy-${data.github_repository.this.name}"
  description = "Policy granting ECR and SST deploy permissions for GitHub Actions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Effect   = "Allow"
        Resource = "*" # Required for GetAuthorizationToken
      },
      {
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetRepositoryPolicy",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
        ]
        Effect = "Allow"
        # Limit to the specific ECR repository if possible, otherwise use "*" if multiple repos are needed
        # Resource = aws_ecr_repository.backend.arn # Example for a specific repo
        Resource = aws_ecr_repository.backend.arn
      },
      {
        Action = [
          "lambda:UpdateFunctionCode"
        ]
        Effect = "Allow"
        # Limit to the specific AWS lambda if possible, otherwise use "*" if multiple functions are needed
        # Resource = aws_ecr_repository.backend.arn # Example for a specific repo
        Resource = aws_lambda_function.backend.arn
      },
      {
        # SST deploy permissions
        Sid    = "ManageBootstrapStateBucket"
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:PutBucketVersioning",
          "s3:PutBucketNotification",
          "s3:PutBucketPolicy",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject",
        ]
        Resource = [
          "arn:aws:s3:::sst-state-*"
        ]
      },
      {
        Sid    = "ManageBootstrapAssetBucket"
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:PutBucketVersioning",
          "s3:PutBucketNotification",
          "s3:PutBucketPolicy",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject",
        ]
        Resource = [
          "arn:aws:s3:::sst-asset-*"
        ]
      },
      {
        Sid    = "ManageBootstrapECRRepo"
        Effect = "Allow"
        Action = [
          "ecr:CreateRepository",
          "ecr:DescribeRepositories",
        ]
        Resource = [
          "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/sst-asset"
        ]
      },
      {
        Sid    = "ManageBootstrapSSMParameter"
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:PutParameter",
        ]
        Resource = [
          "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/sst/passphrase/*",
          "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/sst/bootstrap"
        ]
      },
      {
        Sid    = "Deployments"
        Effect = "Allow"
        Action = [
          "*"
        ]
        Resource = [
          "*"
        ]
      },
      {
        Sid    = "ManageSecrets"
        Effect = "Allow"
        Action = [
          "ssm:DeleteParameter",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath",
          "ssm:PutParameter"
        ]
        Resource = [
          "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/sst/*"
        ]
      },
      {
        Sid    = "LiveLambdaSocketConnection"
        Effect = "Allow"
        Action = [
          "appsync:EventSubscribe",
          "appsync:EventPublish",
          "appsync:EventConnect",
        ]
        Resource = [
          "*"
        ]
      }
    ]
  })

  tags = {
    Terraform  = "true"
    Repository = data.github_repository.this.name
  }
}

# Attach the ECR policy to the GitHub Actions IAM user
resource "aws_iam_user_policy_attachment" "github_actions_attach" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.github_actions.arn
}

# Create access keys for the GitHub Actions IAM user
resource "aws_iam_access_key" "github_actions" {
  user = aws_iam_user.github_actions.name
}
