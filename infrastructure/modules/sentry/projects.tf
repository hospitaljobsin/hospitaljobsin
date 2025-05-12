resource "sentry_project" "backend" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs API"
  platform     = "python-fastapi"
}

resource "sentry_project_spike_protection" "backend" {
  organization = sentry_project.backend.organization
  project      = sentry_project.backend.id
  enabled      = true
}

resource "sentry_organization_code_mapping" "backend" {
  organization   = data.sentry_organization.main.id
  integration_id = data.sentry_organization_integration.github.id
  repository_id  = sentry_organization_repository.github.id
  project_id     = sentry_project.backend.internal_id

  default_branch = "main"
  stack_root     = "/"
  source_root    = "server/"
}

resource "sentry_project" "accounts_ui" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs Accounts UI"
  platform     = "javascript-nextjs"

  client_security {
    allowed_domains = [
      "https://accounts.${var.domain_name}",
      "http://localhost:5002",
    ]
  }
}

resource "sentry_project_spike_protection" "accounts_ui" {
  organization = sentry_project.accounts_ui.organization
  project      = sentry_project.accounts_ui.id
  enabled      = true
}

resource "sentry_organization_code_mapping" "accounts_ui" {
  organization   = data.sentry_organization.main.id
  integration_id = data.sentry_organization_integration.github.id
  repository_id  = sentry_organization_repository.github.id
  project_id     = sentry_project.accounts_ui.internal_id

  default_branch = "main"
  stack_root     = "/"
  source_root    = "apps/accounts/"
}

resource "sentry_project" "seeker_portal_ui" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs Seeker Portal UI"
  platform     = "javascript-nextjs"
}

resource "sentry_project_spike_protection" "seeker_portal_ui" {
  organization = sentry_project.seeker_portal_ui.organization
  project      = sentry_project.seeker_portal_ui.id
  enabled      = true
}

resource "sentry_organization_code_mapping" "seeker_portal_ui" {
  organization   = data.sentry_organization.main.id
  integration_id = data.sentry_organization_integration.github.id
  repository_id  = sentry_organization_repository.github.id
  project_id     = sentry_project.seeker_portal_ui.internal_id

  default_branch = "main"
  stack_root     = "/"
  source_root    = "apps/seeker-portal/"
}

resource "sentry_project" "recruiter_portal_ui" {
  organization = sentry_team.main.organization
  teams        = [sentry_team.main.id]
  name         = "Hospital Jobs Recruiter Portal UI"
  platform     = "javascript-nextjs"
}

resource "sentry_project_spike_protection" "recruiter_portal_ui" {
  organization = sentry_project.recruiter_portal_ui.organization
  project      = sentry_project.recruiter_portal_ui.id
  enabled      = true
}

resource "sentry_organization_code_mapping" "recruiter_portal_ui" {
  organization   = data.sentry_organization.main.id
  integration_id = data.sentry_organization_integration.github.id
  repository_id  = sentry_organization_repository.github.id
  project_id     = sentry_project.recruiter_portal_ui.internal_id

  default_branch = "main"
  stack_root     = "/"
  source_root    = "apps/recruiter-portal/"
}
