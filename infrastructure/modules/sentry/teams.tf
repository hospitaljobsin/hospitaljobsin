resource "sentry_team" "main" {
  organization = data.sentry_organization.main.id
  name         = "Dev Team"
}
