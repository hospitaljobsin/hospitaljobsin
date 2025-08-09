resource "aws_ses_email_identity" "this" {
  email = "noreply@${var.domain_name}"


}

resource "aws_ses_domain_identity" "this" {
  domain = var.domain_name

}

resource "aws_ses_domain_identity_verification" "example_verification" {
  domain = aws_ses_domain_identity.this.domain

  depends_on = [aws_route53_record.ses_verification]

}

resource "aws_ses_domain_dkim" "this" {
  domain = aws_ses_domain_identity.this.domain

}
