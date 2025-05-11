data "sentry_organization" "main" {
  # Taken from URL: https://sentry.io/organizations/[slug]/issues/
  slug = var.sentry_organization_slug
}
