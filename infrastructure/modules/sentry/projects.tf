resource "sentry_project" "backend" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs API"
  platform     = "python-fastapi"
}


resource "sentry_project" "accounts_ui" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs Accounts UI"
  platform     = "javascript-nextjs"
}


resource "sentry_project" "seeker_portal_ui" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs Seeker Portal UI"
  platform     = "javascript-nextjs"
}


resource "sentry_project" "recruiter_portal_ui" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs Recruiter Portal UI"
  platform     = "javascript-nextjs"
}
