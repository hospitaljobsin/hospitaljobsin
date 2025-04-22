resource "cloudflare_turnstile_widget" "example" {
  account_id = var.cloudflare_acount_id
  name       = "My Terraform-managed widget"
  domains    = ["${var.domain_name}", "recruiter.${var.domain_name}", "accounts.${var.domain_name}", "localhost"]
  mode       = "managed"
}
