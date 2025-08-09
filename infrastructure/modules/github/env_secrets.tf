# Store the AWS Access Key ID as a GitHub Actions secret
resource "github_actions_environment_secret" "aws_access_key_id" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "DEPLOYMENT_AWS_ACCESS_KEY_ID"
  plaintext_value = var.deployment_aws_access_key_id
}

# Store the AWS Secret Access Key as a GitHub Actions secret
resource "github_actions_environment_secret" "aws_secret_access_key" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "DEPLOYMENT_AWS_SECRET_ACCESS_KEY"
  plaintext_value = var.deployment_aws_secret_access_key
}

resource "github_actions_environment_secret" "sst_accounts_secret_id" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_ACCOUNTS_SECRET_ID"
  plaintext_value = var.sst_accounts_secret_id
}

resource "github_actions_environment_secret" "accounts_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "ACCOUNTS_SENTRY_DSN"
  plaintext_value = var.sentry_accounts_ui_dsn
}


resource "github_actions_environment_secret" "sst_seeker_portal_secret_id" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_SEEKER_PORTAL_SECRET_ID"
  plaintext_value = var.sst_seeker_portal_secret_id
}

resource "github_actions_environment_secret" "seeker_portal_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SEEKER_PORTAL_SENTRY_DSN"
  plaintext_value = var.sentry_seeker_portal_ui_dsn
}


resource "github_actions_environment_secret" "sst_recruiter_portal_secret_id" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_RECRUITER_PORTAL_SECRET_ID"
  plaintext_value = var.sst_recruiter_portal_secret_id
}

resource "github_actions_environment_secret" "sst_recruiter_dashboard_secret_id" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_RECRUITER_DASHBOARD_SECRET_ID"
  plaintext_value = var.sst_recruiter_dashboard_secret_id
}

resource "github_actions_environment_secret" "recruiter_portal_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "RECRUITER_PORTAL_SENTRY_DSN"
  plaintext_value = var.sentry_recruiter_portal_ui_dsn
}


resource "github_actions_environment_secret" "server_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SERVER_SENTRY_DSN"
  plaintext_value = var.sentry_backend_dsn
}


resource "github_actions_environment_secret" "recruiter_dashboard_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "RECRUITER_DASHBOARD_SENTRY_DSN"
  plaintext_value = var.sentry_recruiter_dashboard_ui_dsn
}
