resource "sentry_key" "backend" {
  organization = data.sentry_organization.main.id

  project = sentry_project.backend.id
  name    = "Backend Key"
}


resource "sentry_key" "accounts_ui" {
  organization = data.sentry_organization.main.id

  project = sentry_project.accounts_ui.id
  name    = "Accounts UI Key"
}


resource "sentry_key" "seeker_portal_ui" {
  organization = data.sentry_organization.main.id

  project = sentry_project.seeker_portal_ui.id
  name    = "Seeker Portal UI Key"
}

resource "sentry_key" "recruiter_portal_ui" {
  organization = data.sentry_organization.main.id

  project = sentry_project.recruiter_portal_ui.id
  name    = "Recruiter Portal UI Key"
}
