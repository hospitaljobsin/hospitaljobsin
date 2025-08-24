packer {
  required_version = ">= 1.9.0"
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.1.0"
    }
    amazon-ami-management = {
      version = ">= 1.0.0"
      source = "github.com/wata727/amazon-ami-management"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_base" {
  type    = string
  default = "ubuntu/images/hvm-ssd/ubuntu-noble-24.04-amd64-server-*"
}

variable "instance_type" {
  type    = string
  default = "t3a.medium"
}

variable "ami_name" {
  type    = string
  default = "playwright-ami"
}

source "amazon-ebs" "playwright" {
  region                  = var.aws_region
  instance_type           = var.instance_type
  ami_name                = "${var.ami_name} ${formatdate("YYYYMMDD-hhmmss", timestamp())}"
  ami_description         = "Ubuntu with Node.js, pnpm, and Playwright installed"
  ssh_username  = "ubuntu"
  ssh_pty       = true
  associate_public_ip_address = true

  source_ami_filter {
    filters = {
      name                = var.ami_base
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    owners      = ["099720109477"] # Canonical
    most_recent = true
  }

  tags = {
    Name        = var.ami_name
    Environment = "staging"
    Amazon_AMI_Management_Identifier = var.ami_name
  }
}

build {
  name    = "playwright-ami"
  sources = ["source.amazon-ebs.playwright"]

  provisioner "shell" {
    script = "scripts/install_playwright.sh"
  }

  post-processor "manifest" {}

  post-processor "amazon-ami-management" {
    regions       = [var.aws_region]
    identifier    = var.ami_name
    keep_releases = 1
  }
}
