output "accounts_cert_arn" {
  value = aws_acm_certificate.accounts_cert.arn
}

output "accounts_domain_name" {
  value = aws_acm_certificate.accounts_cert.domain_name
}

output "seeker_portal_cert_arn" {
  value = aws_acm_certificate.seeker_portal_cert.arn
}

output "seeker_portal_domain_name" {
  value = aws_acm_certificate.seeker_portal_cert.domain_name
}

output "recruiter_portal_cert_arn" {
  value = aws_acm_certificate.recruiter_portal_cert.arn
}

output "recruiter_portal_domain_name" {
  value = aws_acm_certificate.recruiter_portal_cert.domain_name
}

output "hosted_zone_id" {
  value = aws_route53_zone.main.zone_id
}
