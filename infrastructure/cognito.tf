resource "aws_cognito_user_pool" "this" {
  name = "${var.resource_prefix}pool"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }


  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "name"
    required            = true
  }

  schema {
    attribute_data_type = "Boolean"
    mutable             = true
    name                = "hasOnboarded"
    required            = false
  }

  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "email"
    required            = true
  }

  # schema {
  #   attribute_data_type = "Number"
  #   mutable             = true
  #   name                = "phone_number"
  #   required            = true
  # }

  password_policy {
    minimum_length    = "8"
    require_numbers   = true
    require_symbols   = false
    require_uppercase = false
  }

  mfa_configuration = "OFF"
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.resource_prefix}webclient"

  generate_secret         = false
  enable_token_revocation = true

  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH"]

  callback_urls                        = ["http://localhost:3000"]
  logout_urls                          = ["http://localhost:3000"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]

  allowed_oauth_scopes         = ["email", "openid", "phone"]
  supported_identity_providers = ["COGNITO"]

  user_pool_id = aws_cognito_user_pool.this.id
}
