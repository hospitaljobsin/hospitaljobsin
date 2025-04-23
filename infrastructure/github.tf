data "github_repository" "this" {
  full_name = var.github_repository_name
}

# Store the AWS Access Key ID as a GitHub Actions secret
resource "github_actions_secret" "aws_access_key_id" {
  repository      = data.github_repository.this.name
  secret_name     = "AWS_ACCESS_KEY_ID"
  plaintext_value = aws_iam_access_key.github_actions.id
}

# Store the AWS Secret Access Key as a GitHub Actions secret
resource "github_actions_secret" "aws_secret_access_key" {
  repository      = data.github_repository.this.name
  secret_name     = "AWS_SECRET_ACCESS_KEY"
  plaintext_value = aws_iam_access_key.github_actions.secret
}

# Set AWS_REGION in GitHub Actions variables
resource "github_actions_variable" "aws_region" {
  repository    = data.github_repository.this.name
  variable_name = "AWS_REGION"
  value         = var.aws_region
}

# Store the backend function name as a variable in GitHub Actions
resource "github_actions_variable" "aws_lambda_backend_function_name" {
  repository    = data.github_repository.this.name
  variable_name = "AWS_BACKEND_FUNCTION_NAME"
  value         = aws_lambda_function.backend.function_name
}

# Store the backend ECR image name as a variable in GitHub Actions
resource "github_actions_variable" "aws_lambda_backend_image" {
  repository    = data.github_repository.this.name
  variable_name = "AWS_BACKEND_IMAGE_NAME"
  value         = aws_ecr_repository.backend.name
}
