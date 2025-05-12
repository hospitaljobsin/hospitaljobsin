data "github_repository" "this" {
  full_name = var.github_repository_name
}


resource "github_actions_variable" "recruiter_portal_sentry_project" {
  repository    = data.github_repository.this.name
  variable_name = "RECRUITER_PORTAL_SENTRY_PROJECT"
  value         = sentry_project.recruiter_portal_ui.id
}

resource "github_actions_variable" "seeker_portal_sentry_project" {
  repository    = data.github_repository.this.name
  variable_name = "SEEKER_PORTAL_SENTRY_PROJECT"
  value         = sentry_project.seeker_portal_ui.id
}

resource "github_actions_variable" "accounts_sentry_project" {
  repository    = data.github_repository.this.name
  variable_name = "ACCOUNTS_SENTRY_PROJECT"
  value         = sentry_project.accounts_ui.id
}
