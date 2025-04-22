resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.resource_prefix}/backend"
  description = "Production settings secret for the backend"
}

resource "aws_secretsmanager_secret_version" "example" {
  secret_id = aws_secretsmanager_secret.backend.id
  secret_string = jsonencode({
    server_jwe_secret_key       = "test",
    server_google_client_id     = "test",
    server_google_client_secret = "test",
    server_recaptcha_secret_key = "test"
  })
}
