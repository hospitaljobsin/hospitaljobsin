output "redis_password" {
  value     = random_string.redis_password.result
  sensitive = true
}


output "public_endpoint" {
  value = rediscloud_essentials_database.database-resource.public_endpoint
}
