resource "github_repository_environment" "this" {
  environment         = var.environment_name
  repository          = data.github_repository.this.name
  prevent_self_review = false
  #   reviewers {
  #     users = [data.github_user.current.id]
  #   }
  deployment_branch_policy {
    # protected_branches     = true
    protected_branches     = true
    custom_branch_policies = false
  }
}
