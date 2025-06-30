resource "rediscloud_essentials_database" "database-resource" {
  subscription_id     = rediscloud_essentials_subscription.subscription-resource.id
  name                = "${var.resource_prefix}-cache-db"
  enable_default_user = true
  #   protocol            = "redis"
  password   = random_string.redis_password.result
  enable_tls = true

  data_persistence = "none"
  replication      = false

  alert {
    name  = "throughput-higher-than"
    value = 80
  }
}
