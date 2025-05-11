resource "sentry_key" "backend" {
  organization = data.sentry_organization.main.id

  project = sentry_project.backend.id
  name    = "Backend Key"
}
