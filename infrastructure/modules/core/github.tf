data "github_repository" "this" {
  full_name = var.github_repository_name
}

# Store the AWS Access Key ID as a GitHub Actions secret
resource "github_actions_secret" "aws_access_key_id" {
  repository      = data.github_repository.this.name
  secret_name     = "DEPLOYMENT_AWS_ACCESS_KEY_ID"
  plaintext_value = aws_iam_access_key.github_actions.id
}

# Store the AWS Secret Access Key as a GitHub Actions secret
resource "github_actions_secret" "aws_secret_access_key" {
  repository      = data.github_repository.this.name
  secret_name     = "DEPLOYMENT_AWS_SECRET_ACCESS_KEY"
  plaintext_value = aws_iam_access_key.github_actions.secret
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


resource "github_actions_variable" "aws_region" {
  repository    = data.github_repository.this.name
  variable_name = "AWS_REGION"
  value         = var.aws_region
}


# SST variables and secrets

resource "github_actions_secret" "sst_jwe_secret_key" {
  repository      = data.github_repository.this.name
  secret_name     = "SST_JWE_SECRET_KEY"
  plaintext_value = random_bytes.jwe_secret.base64
}

resource "github_actions_variable" "sst_api_url" {
  repository    = data.github_repository.this.name
  variable_name = "SST_API_URL"
  value         = "https://api.${var.domain_name}"
}

resource "github_actions_variable" "sst_vpc_id" {
  repository    = data.github_repository.this.name
  variable_name = "SST_VPC_ID"
  value         = aws_vpc.this.id
}

resource "github_actions_variable" "sst_accounts_domain" {
  repository    = data.github_repository.this.name
  variable_name = "SST_ACCOUNTS_DOMAIN"
  value         = "accounts.${var.domain_name}"
}


resource "github_actions_variable" "sst_captcha_site_key" {
  repository    = data.github_repository.this.name
  variable_name = "SST_CAPTCHA_SITE_KEY"
  value         = cloudflare_turnstile_widget.example.id
}

resource "github_actions_variable" "sst_recruiter_portal_base_url" {
  repository    = data.github_repository.this.name
  variable_name = "SST_RECRUITER_PORTAL_BASE_URL"
  value         = "https://recruiter.${var.domain_name}"
}

resource "github_actions_variable" "sst_seeker_portal_base_url" {
  repository    = data.github_repository.this.name
  variable_name = "SST_SEEKER_PORTAL_BASE_URL"
  value         = "https://${var.domain_name}"
}

resource "github_actions_variable" "sst_accounts_base_url" {
  repository    = data.github_repository.this.name
  variable_name = "SST_ACCOUNTS_BASE_URL"
  value         = "https://accounts.${var.domain_name}"
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

resource "github_actions_variable" "sst_vpc_private_subnets" {
  repository    = data.github_repository.this.name
  variable_name = "SST_VPC_PRIVATE_SUBNETS"
  # comma‑delimited list
  value = join(",", data.aws_subnets.private.ids)
}
resource "github_actions_variable" "sst_vpc_security_groups" {
  repository    = data.github_repository.this.name
  variable_name = "SST_VPC_SECURITY_GROUPS"
  value         = join(",", data.aws_security_groups.vpc.ids)
}
