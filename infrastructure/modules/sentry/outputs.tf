output "sentry_backend_dsn" {
  value = sentry_key.backend.dsn["public"]
}


output "sentry_accounts_ui_dsn" {
  value = sentry_key.accounts_ui.dsn["public"]
}


output "sentry_seeker_portal_ui_dsn" {
  value = sentry_key.seeker_portal_ui.dsn["public"]
}


output "sentry_recruiter_portal_ui_dsn" {
  value = sentry_key.recruiter_portal_ui.dsn["public"]
}
