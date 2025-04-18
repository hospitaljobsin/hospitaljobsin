resource "mongodbatlas_project" "project" {
  name   = "${var.resource_prefix}-project"
  org_id = var.mongodb_atlas_org_id

  limits {
    name  = "atlas.project.deployment.clusters"
    value = 2
  }

  limits {
    name  = "atlas.project.deployment.nodesPerPrivateLinkRegion"
    value = 3
  }
  lifecycle {
    ignore_changes = [
      tags["CostCenter"]
    ]
  }
}

resource "mongodbatlas_flex_cluster" "example-cluster" {
  project_id = mongodbatlas_project.project.id
  name       = "${var.resource_prefix}-cluster"
  provider_settings = {
    backing_provider_name = "AWS"
    region_name           = var.mongodb_atlas_region
  }
  termination_protection_enabled = true
}


resource "mongodbatlas_database_user" "user" {
  username           = var.dbuser
  password           = var.dbuser_password
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = var.mongodb_database_name # The database name and collection name need not exist in the cluster before creating the user.
  }
  labels {
    key   = "Name"
    value = "DB User1"
  }
}


resource "mongodbatlas_privatelink_endpoint" "pe_east" {
  project_id    = mongodbatlas_project.project.id
  provider_name = "AWS"
  region        = var.region
}

resource "mongodbatlas_privatelink_endpoint_service" "pe_east_service" {
  project_id          = mongodbatlas_privatelink_endpoint.pe_east.project_id
  private_link_id     = mongodbatlas_privatelink_endpoint.pe_east.id
  endpoint_service_id = aws_vpc_endpoint.vpce_east.id
  provider_name       = "AWS"
}
