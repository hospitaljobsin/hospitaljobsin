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

resource "github_actions_environment_secret" "sst_jwe_secret_key" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_JWE_SECRET_KEY"
  plaintext_value = var.sst_jwe_secret_key
}

resource "github_actions_environment_secret" "sst_revalidate_secret" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_REVALIDATE_SECRET"
  plaintext_value = var.sst_revalidate_secret
}


resource "github_actions_environment_secret" "accounts_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "ACCOUNTS_SENTRY_DSN"
  plaintext_value = var.sentry_accounts_ui_dsn
}

resource "github_actions_environment_secret" "cms_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "CMS_SENTRY_DSN"
  plaintext_value = var.sentry_cms_ui_dsn

}

resource "github_actions_environment_secret" "seeker_portal_sentry_dsn" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SEEKER_PORTAL_SENTRY_DSN"
  plaintext_value = var.sentry_seeker_portal_ui_dsn
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

resource "github_actions_environment_secret" "basic_auth_username" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "BASIC_AUTH_USERNAME"
  plaintext_value = var.basic_auth_username
}

resource "github_actions_environment_secret" "basic_auth_password" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "BASIC_AUTH_PASSWORD"
  plaintext_value = var.basic_auth_password
}


resource "github_actions_environment_secret" "cms_database_uri" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_CMS_DATABASE_URI"
  plaintext_value = "${var.sst_cms_database_uri}?authMechanism=MONGODB-AWS&authSource=$external"
}

resource "github_actions_environment_secret" "cms_payload_secret" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_CMS_PAYLOAD_SECRET"
  plaintext_value = var.sst_cms_payload_secret
}

resource "github_actions_environment_secret" "cms_cron_secret" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_CMS_CRON_SECRET"
  plaintext_value = var.sst_cms_cron_secret
}

resource "github_actions_environment_secret" "cms_preview_secret" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "SST_CMS_PREVIEW_SECRET"
  plaintext_value = var.sst_cms_preview_secret
}

resource "github_actions_environment_secret" "bing_indexnow_api_key" {
  repository      = data.github_repository.this.name
  environment     = github_repository_environment.this.environment
  secret_name     = "BING_INDEXNOW_API_KEY"
  plaintext_value = var.bing_indexnow_api_key
}
