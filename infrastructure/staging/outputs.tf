output "basic_auth_username" {
  value = module.core.basic_auth_username
}

output "basic_auth_password" {
  value     = module.core.basic_auth_password
  sensitive = true
}
