data "rediscloud_payment_method" "card" {
  card_type = "Visa"
}

data "rediscloud_essentials_plan" "plan" {
  name                  = "250MB"
  cloud_provider        = "AWS"
  region                = var.aws_region
  size                  = 250
  size_measurement_unit = "MB"
}

resource "rediscloud_essentials_subscription" "subscription-resource" {
  name              = "${var.resource_prefix}-cache-subscription"
  plan_id           = data.rediscloud_essentials_plan.plan.id
  payment_method_id = data.rediscloud_payment_method.card.id
}
