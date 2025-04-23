resource "random_bytes" "jwt_secret" {
  length = 64
}

resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.resource_prefix}/backend"
  description = "Production settings secret for the backend"
}

resource "aws_secretsmanager_secret_version" "example" {
  secret_id = aws_secretsmanager_secret.backend.id
  secret_string = jsonencode({
    server_jwe_secret_key       = random_bytes.jwt_secret.base64,
    server_google_client_id     = google_iap_client.project_client.client_id,
    server_google_client_secret = google_iap_client.project_client.secret,
    server_captcha_secret_key   = cloudflare_turnstile_widget.example.secret
  })
}
