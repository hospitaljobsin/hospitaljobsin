resource "aws_secretsmanager_secret" "recaptcha_site_key" {
  name        = "recaptcha/site-key"
  description = "Google reCAPTCHA site key"
}

resource "aws_secretsmanager_secret" "recaptcha_secret_key" {
  name        = "recaptcha/secret-key"
  description = "Google reCAPTCHA secret key"
}
