data "sentry_organization_integration" "github" {
  organization = data.sentry_organization.main.id
  provider_key = "github"
  name         = var.github_organization_name
}

resource "sentry_organization_repository" "github" {
  organization     = data.sentry_organization.main.id
  integration_type = "github"
  integration_id   = data.sentry_organization_integration.github.id
  identifier       = var.github_repository_full_name
}
