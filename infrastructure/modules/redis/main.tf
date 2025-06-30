terraform {
  required_version = ">= 1.3.0"

  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    rediscloud = {
      source  = "RedisLabs/rediscloud"
      version = "2.1.4"
    }
  }
}
