output "sentry_backend_dsn" {
  value = sentry_key.backend.dsn["public"]
}


output "sentry_accounts_ui_dsn" {
  value = sentry_key.accounts_ui.dsn["public"]
}
