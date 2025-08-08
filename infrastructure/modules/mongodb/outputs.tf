output "connection_string" {
  value = mongodbatlas_advanced_cluster.this.connection_strings[0].standard_srv
}
