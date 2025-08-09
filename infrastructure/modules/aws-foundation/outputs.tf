output "vpc_id" {
  value = aws_vpc.this.id
}

// Fetch private subnets in the VPC

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [aws_vpc.this.id]
  }
  filter {
    name   = "map-public-ip-on-launch"
    values = [false]
  }
}

// Fetch all security groups in the VPC
data "aws_security_groups" "vpc" {
  filter {
    name   = "vpc-id"
    values = [aws_vpc.this.id]
  }
}

output "sst_vpc_private_subnets" {
  # comma‑delimited list
  value = join(",", data.aws_subnets.private.ids)
}

output "sst_vpc_security_groups" {
  value = join(",", data.aws_security_groups.vpc.ids)
}


output "hosted_zone_id" {
  value = aws_route53_zone.main.zone_id
}


# Store the backend ECR image name as a variable in GitHub Actions
output "aws_lambda_worker_image" {
  value = aws_ecr_repository.worker.name
}

output "aws_lambda_worker_repository_url" {
  value = aws_ecr_repository.worker.repository_url
}

output "aws_lambda_worker_repository_arn" {
  value = aws_ecr_repository.worker.arn
}

output "aws_lambda_backend_image" {
  value = aws_ecr_repository.backend.name
}

output "aws_lambda_backend_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "aws_lambda_backend_repository_arn" {
  value = aws_ecr_repository.backend.arn
}

# Store the AWS Access Key ID as a GitHub Actions secret
output "aws_access_key_id" {
  value     = aws_iam_access_key.github_actions.id
  sensitive = true
}

# Store the AWS Secret Access Key as a GitHub Actions secret
output "aws_secret_access_key" {
  value     = aws_iam_access_key.github_actions.secret
  sensitive = true
}
