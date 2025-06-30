resource "random_string" "redis_password" {
  length  = 32
  special = false
}
