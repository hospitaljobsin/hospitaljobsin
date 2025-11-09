output "connection_string" {
  value = mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv
}


output "cms_connection_string" {
  # Build a connection string with username and password for the CMS user
  # Format: mongodb+srv://username:password@host/cms
  value     = replace(mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv, "://", "://${mongodbatlas_database_user.cms_user.username}:${random_password.cms_user_password.result}@")
  sensitive = true
}
