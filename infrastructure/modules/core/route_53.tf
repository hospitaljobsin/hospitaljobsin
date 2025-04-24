resource "aws_route53_zone" "main" {
  name = var.domain_name # e.g., "example.com"
}

resource "aws_acm_certificate" "api_cert" {
  domain_name       = "api.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "api_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "api_cert" {
  certificate_arn         = aws_acm_certificate.api_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]

  depends_on = [aws_route53_record.api_cert_validation]

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [validation_record_fqdns]
  }
}

resource "aws_acm_certificate" "seeker_portal_cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "seeker_portal_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.seeker_portal_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "seeker_portal_cert" {
  certificate_arn         = aws_acm_certificate.seeker_portal_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.seeker_portal_cert_validation : record.fqdn]

  depends_on = [aws_route53_record.seeker_portal_cert_validation]

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [validation_record_fqdns]
  }
}

resource "aws_acm_certificate" "recruiter_portal_cert" {
  domain_name       = "recruiter.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "recruiter_portal_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.recruiter_portal_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "recruiter_portal_cert" {
  certificate_arn         = aws_acm_certificate.recruiter_portal_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.recruiter_portal_cert_validation : record.fqdn]

  depends_on = [aws_route53_record.recruiter_portal_cert_validation]

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [validation_record_fqdns]
  }
}


resource "aws_acm_certificate" "accounts_cert" {
  domain_name       = "accounts.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "accounts_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.accounts_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "accounts_cert" {
  certificate_arn         = aws_acm_certificate.accounts_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.accounts_cert_validation : record.fqdn]

  depends_on = [aws_route53_record.accounts_cert_validation]

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [validation_record_fqdns]
  }
}

resource "aws_route53_record" "api_gateway" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.custom.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.custom.cloudfront_zone_id
    evaluate_target_health = false
  }
}


resource "aws_route53_record" "ses_verification" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = [aws_ses_domain_identity.this.verification_token]
}

resource "aws_route53_record" "dkim_records" {
  count   = 3
  zone_id = aws_route53_zone.main.zone_id
  name    = "${aws_ses_domain_dkim.this.dkim_tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 600
  records = ["${aws_ses_domain_dkim.this.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

resource "aws_route53_record" "spf" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 600
  records = ["v=spf1 include:amazonses.com ~all"]
}
