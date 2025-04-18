resource "aws_ses_email_identity" "sender" {
  email = "noreply@${var.domain_name}"
}

resource "aws_ses_domain_dkim" "this" {
  domain = aws_ses_domain_identity.this.domain
}
