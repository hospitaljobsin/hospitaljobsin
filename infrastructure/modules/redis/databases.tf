resource "rediscloud_essentials_database" "database-resource" {
  subscription_id     = rediscloud_essentials_subscription.subscription-resource.id
  name                = "${var.resource_prefix}-cache-db"
  enable_default_user = true
  #   protocol            = "redis"
  password   = random_string.redis_password.result
  enable_tls = true

  # Free 30MB plan has limitations - no data persistence or replication
  data_persistence = var.environment_name == "production" ? "none" : "none"
  replication      = var.environment_name == "production" ? false : false

  # Free plans don't support custom alerts
  dynamic "alert" {
    for_each = var.environment_name == "production" ? [1] : []
    content {
      name  = "throughput-higher-than"
      value = 80
    }
  }
}
