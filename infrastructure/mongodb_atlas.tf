resource "mongodbatlas_project" "project" {
  name   = "project-name"
  org_id = var.mongodb_atlas_org_id

  limits {
    name  = "atlas.project.deployment.clusters"
    value = 2
  }

  limits {
    name  = "atlas.project.deployment.nodesPerPrivateLinkRegion"
    value = 3
  }
  tags = {
    Owner       = "Terraform"
    Environment = "Example"
    Team        = "tf-experts"
    CurrentDRI  = "unset"
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
