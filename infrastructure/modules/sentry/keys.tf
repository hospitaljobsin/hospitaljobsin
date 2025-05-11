resource "sentry_key" "backend" {
  organization = "my-organization"

  project = sentry_project.backend.slug
  name    = "Backend Key"
}
