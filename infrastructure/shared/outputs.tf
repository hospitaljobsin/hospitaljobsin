output "sentry_backend_dsn" {
  value     = module.sentry.sentry_backend_dsn
  sensitive = true
}


output "sentry_accounts_ui_dsn" {
  value     = module.sentry.sentry_accounts_ui_dsn
  sensitive = true
}


output "sentry_seeker_portal_ui_dsn" {
  value     = module.sentry.sentry_seeker_portal_ui_dsn
  sensitive = true
}


output "sentry_recruiter_portal_ui_dsn" {
  value     = module.sentry.sentry_recruiter_portal_ui_dsn
  sensitive = true
}


output "sentry_recruiter_dashboard_ui_dsn" {
  value     = module.sentry.sentry_recruiter_dashboard_ui_dsn
  sensitive = true
}

output "recruiter_portal_sentry_project" {
  value = module.sentry.recruiter_portal_sentry_project
}

output "recruiter_dashboard_sentry_project" {
  value = module.sentry.recruiter_dashboard_sentry_project
}


output "seeker_portal_sentry_project" {
  value = module.sentry.seeker_portal_sentry_project
}

output "accounts_sentry_project" {
  value = module.sentry.accounts_sentry_project
}


output "sentry_organization" {
  value = module.sentry.sentry_organization
}
