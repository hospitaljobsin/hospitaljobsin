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
      # Use M0 free tier for staging, current config for other environments
      provider_name         = var.environment_name == "staging" ? "TENANT" : "FLEX"
      backing_provider_name = "AWS"
      region_name           = var.mongodb_atlas_region
      priority              = 7

      # Add electable_specs for M0 free tier (staging environment)
      dynamic "electable_specs" {
        for_each = var.environment_name == "staging" ? [1] : []
        content {
          instance_size = "M0"
        }
      }
    }
  }

  termination_protection_enabled = true
  backup_enabled                 = var.environment_name == "staging" ? false : true # M0 free tier doesn't support backups
}

# locals {
#   endpoint_service_id = mongodbatlas_privatelink_endpoint_service.pe_east_service.id
#   private_endpoints   = try(flatten([for cs in mongodbatlas_advanced_cluster.this.connection_strings : cs.private_endpoint]), [])
#   connection_strings = [
#     for pe in local.private_endpoints : pe.srv_connection_string
#     if contains([for e in pe.endpoints : e.endpoint_id], local.endpoint_service_id)
#   ]
# }
# output "endpoint_service_connection_string" {
#   value = length(local.connection_strings) > 0 ? local.connection_strings[0] : ""
# }



resource "mongodbatlas_database_user" "user" {
  username           = var.lambda_username
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "$external"
  aws_iam_type       = "ROLE"

  roles {
    role_name     = "readWrite"
    database_name = var.mongodb_database_name # The database name and collection name need not exist in the cluster before creating the user.
  }
}

resource "mongodbatlas_database_user" "ecs_user" {
  username           = var.ecs_username
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "$external"
  aws_iam_type       = "ROLE"

  roles {
    role_name     = "readWrite"
    database_name = var.mongodb_database_name # The database name and collection name need not exist in the cluster before creating the user.
  }
}

resource "mongodbatlas_database_user" "worker_user" {
  username           = var.worker_username
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "$external"
  aws_iam_type       = "ROLE"

  roles {
    role_name     = "readWrite"
    database_name = var.mongodb_database_name # The database name and collection name need not exist in the cluster before creating the user.
  }
}

# Flexible backups are only supported on M10+ clusters
# resource "mongodbatlas_cloud_backup_schedule" "this" {
#   project_id   = mongodbatlas_advanced_cluster.this.project_id
#   cluster_name = mongodbatlas_advanced_cluster.this.name

#   reference_hour_of_day    = 3
#   reference_minute_of_hour = 45
#   restore_window_days      = 4

#   // This will now add the desired policy items to the existing mongodbatlas_cloud_backup_schedule resource
#   policy_item_daily {
#     frequency_interval = 1
#     retention_unit     = "days"
#     retention_value    = 14
#   }

#   copy_settings {
#     cloud_provider = "AWS"
#     frequencies = ["HOURLY",
#       "DAILY",
#       "WEEKLY",
#       "MONTHLY",
#       "YEARLY",
#     "ON_DEMAND"]
#     region_name        = var.mongodb_atlas_region
#     zone_id            = mongodbatlas_advanced_cluster.this.replication_specs.*.zone_id[0]
#     should_copy_oplogs = false
#   }

# }


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
#   depends_on          = [mongodbatlas_privatelink_endpoint.pe_east]
# }


# Hence we use an alternative- IP access list
resource "mongodbatlas_project_ip_access_list" "this" {
  project_id = mongodbatlas_project.project.id
  cidr_block = "0.0.0.0/0" # This allows access from any IP address
  comment    = "cidr block for tf acc testing"
}


# resource "aws_vpc_endpoint" "vpce_east" {
#   vpc_id            = data.aws_vpc.default.id
#   service_name      = mongodbatlas_privatelink_endpoint.pe_east.endpoint_service_name
#   vpc_endpoint_type = "Interface"

#   subnet_ids         = data.aws_subnets.default.ids
#   security_group_ids = [aws_security_group.ecs_sg.id]
# }
