data "rediscloud_payment_method" "card" {
  card_type = "Visa"
}

data "rediscloud_essentials_plan" "plan" {
  name                  = var.environment_name == "production" ? "250MB" : "30MB"
  cloud_provider        = "AWS"
  region                = var.aws_region
  size                  = var.environment_name == "production" ? 250 : 30
  size_measurement_unit = "MB"
}

resource "rediscloud_essentials_subscription" "subscription-resource" {
  name              = "${var.resource_prefix}-cache-subscription"
  plan_id           = data.rediscloud_essentials_plan.plan.id
  payment_method_id = var.environment_name == "production" ? data.rediscloud_payment_method.card.id : null
}
