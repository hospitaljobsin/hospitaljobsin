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


output "recruiter_portal_sentry_project" {
  value = sentry_project.recruiter_portal_ui.id
}

output "seeker_portal_sentry_project" {
  value = sentry_project.seeker_portal_ui.id
}

output "accounts_sentry_project" {
  value = sentry_project.accounts_ui.id
}


output "sentry_organization" {
  value = data.sentry_organization.main.id
}
