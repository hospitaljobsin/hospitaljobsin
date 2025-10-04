resource "random_bytes" "jwe_secret" {
  length = 16
}

resource "random_bytes" "revalidate_secret" {
  length = 16
}

resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.resource_prefix}/backend"
  description = "Settings secret for the backend"
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_secretsmanager_secret_version" "example" {
  secret_id = aws_secretsmanager_secret.backend.id
  secret_string = jsonencode({
    server_jwe_secret_key        = random_bytes.jwe_secret.hex,
    server_revalidate_secret     = random_bytes.revalidate_secret.hex,
    server_google_client_id      = var.google_oauth_client_id,
    server_google_client_secret  = var.google_oauth_client_secret,
    server_captcha_secret_key    = var.turnstile_widget_secret,
    server_redis_password        = var.redis_password,
    server_whatsapp_access_token = var.whatsapp_access_token,
    server_two_factor_in_api_key = var.two_factor_in_api_key,
    server_posthog_api_key       = var.posthog_api_key,
  })

  depends_on = [random_bytes.jwe_secret, ]
}
