terraform {
  required_version = ">= 1.3.0"

  required_providers {
    sentry = {
      source  = "jianyuan/sentry"
      version = "0.15.6"
    }
  }
}
