data "github_repository" "this" {
  full_name = var.github_repository_name
}

# TODO: create an IAM user/ role with ECR permissions alone (least privilege)
# then store the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in github actions secrets here
# also set AWS_REGION in github actions variables
# also store the backend function name as a secret/ variable in github actions here

resource "github_actions_variable" "aws_lambda_backend_function_name" {
  repository    = data.github_repository.this.name
  variable_name = "AWS_BACKEND_FUNCTION_NAME"
  value         = aws_lambda_function.backend.function_name
}

resource "github_actions_variable" "aws_lambda_backend_image" {
  repository    = data.github_repository.this.name
  variable_name = "AWS_BACKEND_IMAGE_NAME"
  value         = aws_ecr_repository.backend.name
}
