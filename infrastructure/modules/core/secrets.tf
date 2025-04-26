resource "random_bytes" "jwt_secret" {
  length = 32
}

resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.resource_prefix}/backend/prod"
  description = "Production settings secret for the backend"
}

resource "aws_secretsmanager_secret_version" "example" {
  secret_id = aws_secretsmanager_secret.backend.id
  secret_string = jsonencode({
    server_jwe_secret_key       = random_bytes.jwt_secret.base64,
    server_google_client_id     = var.google_oauth_client_id,
    server_google_client_secret = var.google_oauth_client_secret,
    server_captcha_secret_key   = cloudflare_turnstile_widget.example.secret
  })
}
