module "opennext_accounts" {
  source  = "nhs-england-tools/opennext/aws"
  version = "1.0.6" # Use the latest release from https://github.com/nhs-england-tools/terraform-aws-opennext/releases

  prefix              = "${var.resource_prefix}-accounts"
  opennext_build_path = "../../../apps/accounts/.open-next" # Path to your .open-next folder
  hosted_zone_id      = var.hosted_zone_id                  # The Route53 hosted zone ID for your domain name
  region              = var.aws_region

  cloudfront = {
    aliases             = [var.domain_name]   # Your domain name
    acm_certificate_arn = var.certificate_arn # The ACM (SSL) certificate for your domain
  }

  server_options = {
    envrionment_variables = {
      JWE_SECRET_KEY = ""
      API_URL        = ""
    }
  }
}
