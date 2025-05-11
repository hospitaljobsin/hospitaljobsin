output "sentry_backend_dsn" {
  value = sentry_key.backend.dsn["public"]
}
