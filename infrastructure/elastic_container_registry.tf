# Create an ECR repository for Backend
resource "aws_ecr_repository" "backend" {
  name = "${var.resource_prefix}-backend"
}



# Permission to ECR for Lambda to pull the image
resource "aws_ecr_repository_policy" "lambda_ecr_policy" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    Version = "2008-10-17",
    Statement = [
      {
        Sid    = "AllowLambdaPull",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
      }
    ]
  })
}
