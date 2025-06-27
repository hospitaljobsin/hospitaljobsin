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


resource "aws_ecr_lifecycle_policy" "lambda" {
  repository = aws_ecr_repository.backend.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 25 images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": 25
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
