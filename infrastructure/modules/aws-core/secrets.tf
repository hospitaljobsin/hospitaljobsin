resource "random_bytes" "jwe_secret" {
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


resource "aws_secretsmanager_secret" "accounts" {
  name        = "${var.resource_prefix}/accounts"
  description = "Settings secret for the accounts edge server."
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_secretsmanager_secret_version" "accounts" {
  secret_id = aws_secretsmanager_secret.accounts.id
  secret_string = jsonencode({
    jwe_secret_key = random_bytes.jwe_secret.hex,
  })

  depends_on = [random_bytes.jwe_secret, ]
}


resource "aws_secretsmanager_secret" "seeker_portal" {
  name        = "${var.resource_prefix}/seeker_portal"
  description = "Settings secret for the seeker portal edge server."
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_secretsmanager_secret_version" "seeker_portal" {
  secret_id = aws_secretsmanager_secret.seeker_portal.id
  secret_string = jsonencode({
    jwe_secret_key = random_bytes.jwe_secret.hex,
  })

  depends_on = [random_bytes.jwe_secret, ]
}

resource "aws_secretsmanager_secret" "recruiter_portal" {
  name        = "${var.resource_prefix}/recruiter_portal"
  description = "Settings secret for the recruiter portal edge server."
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_secretsmanager_secret_version" "recruiter_portal" {
  secret_id = aws_secretsmanager_secret.recruiter_portal.id
  secret_string = jsonencode({
    jwe_secret_key = random_bytes.jwe_secret.hex,
  })

  depends_on = [random_bytes.jwe_secret, ]
}

resource "aws_secretsmanager_secret" "recruiter_dashboard" {
  name        = "${var.resource_prefix}/recruiter_dashboard"
  description = "Settings secret for the recruiter dashboard edge server."
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_secretsmanager_secret_version" "recruiter_dashboard" {
  secret_id = aws_secretsmanager_secret.recruiter_dashboard.id
  secret_string = jsonencode({
    jwe_secret_key = random_bytes.jwe_secret.hex,
  })

  depends_on = [random_bytes.jwe_secret, ]
}
