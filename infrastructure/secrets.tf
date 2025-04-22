resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.resource_prefix}/backend"
  description = "Production settings secret for the backend"
}

resource "aws_secretsmanager_secret_version" "example" {
  secret_id = aws_secretsmanager_secret.backend.id
  secret_string = jsonencode({
    SERVER_JWE_SECRET_KEY       = "",
    SERVER_GOOGLE_CLIENT_ID     = "",
    SERVER_GOOGLE_CLIENT_SECRET = "",
    SERVER_RECAPTCHA_SECRET_KEY = ""
  })
}
