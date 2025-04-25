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

resource "mongodbatlas_advanced_cluster" "this" {
  project_id   = mongodbatlas_project.project.id
  name         = "${var.resource_prefix}-cluster"
  cluster_type = "REPLICASET"

  replication_specs {
    region_configs {
      electable_specs {
        instance_size = "M0"
      }

      provider_name         = "TENANT"
      backing_provider_name = "AWS"
      priority              = 7
      region_name           = var.mongodb_atlas_region
    }
  }

  termination_protection_enabled = true
}

# comment out the following after setting the password initially
resource "random_string" "mongodb_atlas_password" {
  length  = 16
  special = true
}


resource "mongodbatlas_database_user" "user" {
  username           = aws_iam_role.lambda_exec_role.arn
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "$external"
  aws_iam_type       = "ROLE"

  # comment out the following after setting the password initially
  password = random_string.mongodb_atlas_password.result

  roles {
    role_name     = "readWrite"
    database_name = var.mongodb_database_name # The database name and collection name need not exist in the cluster before creating the user.
  }
}


# these resources are not available for tenant/ flex deployments

# resource "mongodbatlas_privatelink_endpoint" "pe_east" {
#   project_id    = mongodbatlas_project.project.id
#   provider_name = "AWS"
#   region        = var.aws_region
# }

# resource "mongodbatlas_privatelink_endpoint_service" "pe_east_service" {
#   project_id          = mongodbatlas_privatelink_endpoint.pe_east.project_id
#   private_link_id     = mongodbatlas_privatelink_endpoint.pe_east.id
#   endpoint_service_id = aws_vpc_endpoint.vpce_east.id
#   provider_name       = "AWS"
# }


# Hence we use an alternative- IP access list
resource "mongodbatlas_project_ip_access_list" "this" {
  project_id = mongodbatlas_project.project.id
  cidr_block = "0.0.0.0/0" # This allows access from any IP address
  comment    = "cidr block for tf acc testing"
}
