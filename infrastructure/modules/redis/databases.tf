data "rediscloud_payment_method" "card" {
  card_type = "Visa"
}

data "rediscloud_essentials_plan" "plan" {
  name           = "Single-Zone_250MB"
  cloud_provider = "AWS"
  region         = var.aws_region
  availability   = "Single-Zone"
}

resource "rediscloud_essentials_subscription" "subscription-resource" {
  name              = "${var.resource_prefix}-cache-subscription"
  plan_id           = data.rediscloud_essentials_plan.plan.id
  payment_method_id = data.rediscloud_payment_method.card.id
}

resource "rediscloud_essentials_database" "database-resource" {
  subscription_id     = rediscloud_essentials_subscription.subscription-resource.id
  name                = "${var.resource_prefix}-cache-db"
  enable_default_user = true
  protocol            = "redis"
  #   password            = "my_password"
  enable_tls = true

  data_persistence = "none"
  replication      = false

  alert {
    name  = "throughput-higher-than"
    value = 80
  }
}
