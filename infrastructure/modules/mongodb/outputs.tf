output "connection_string" {
  value = mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv
}


output "cms_connection_string" {
  # Append /cms database name to the connection string
  # If there are query parameters (?...), insert /cms before them
  # Otherwise, append /cms at the end
  value = can(regex("\\?", mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv)) ? replace(mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv, "/(\\?)", "/${var.mongodb_cms_database_name}$1") : "${mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv}/${var.mongodb_cms_database_name}"
}
