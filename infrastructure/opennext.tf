module "opennext_seeker_portal" {
  source  = "nhs-england-tools/opennext/aws"
  version = "1.0.6" # Use the latest release from https://github.com/nhs-england-tools/terraform-aws-opennext/releases

  prefix              = "${var.resource_prefix}-seekerportal"
  opennext_build_path = "../apps/seeker-portal/.open-next" # Path to your .open-next folder
  hosted_zone_id      = aws_route53_zone.main.zone_id      # The Route53 hosted zone ID for your domain name

  cloudfront = {
    aliases             = [aws_acm_certificate.seeker_portal_cert.domain_name]              # Your domain name
    acm_certificate_arn = aws_acm_certificate_validation.seeker_portal_cert.certificate_arn # The ACM (SSL) certificate for your domain
  }
}


module "opennext_recruiter_portal" {
  source  = "nhs-england-tools/opennext/aws"
  version = "1.0.6" # Use the latest release from https://github.com/nhs-england-tools/terraform-aws-opennext/releases

  prefix              = "${var.resource_prefix}-recruiterportal"
  opennext_build_path = "../apps/recruiter-portal/.open-next" # Path to your .open-next folder
  hosted_zone_id      = aws_route53_zone.main.zone_id         # The Route53 hosted zone ID for your domain name

  cloudfront = {
    aliases             = [aws_acm_certificate.recruiter_portal_cert.domain_name]              # Your domain name
    acm_certificate_arn = aws_acm_certificate_validation.recruiter_portal_cert.certificate_arn # The ACM (SSL) certificate for your domain
  }
}


module "opennext_accounts" {
  source  = "nhs-england-tools/opennext/aws"
  version = "1.0.6" # Use the latest release from https://github.com/nhs-england-tools/terraform-aws-opennext/releases

  prefix              = "${var.resource_prefix}-accounts"
  opennext_build_path = "../apps/accounts/.open-next" # Path to your .open-next folder
  hosted_zone_id      = aws_route53_zone.main.zone_id # The Route53 hosted zone ID for your domain name

  cloudfront = {
    aliases             = [aws_acm_certificate.accounts_cert.domain_name]              # Your domain name
    acm_certificate_arn = aws_acm_certificate_validation.accounts_cert.certificate_arn # The ACM (SSL) certificate for your domain
  }
}
