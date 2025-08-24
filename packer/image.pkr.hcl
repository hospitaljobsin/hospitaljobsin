packer {
  required_version = ">= 1.9.0"
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.1.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_base" {
  type    = string
  default = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"
}

variable "instance_type" {
  type    = string
  default = "t3.medium"
}

variable "ami_name" {
  type    = string
  default = "playwright-ami"
}

source "amazon-ebs" "playwright" {
  region                  = var.aws_region
  instance_type           = var.instance_type
  ami_name                = "${var.ami_name}-${formatdate("YYYYMMDD-hhmmss", timestamp())}"
  ami_description         = "Ubuntu with Node.js, pnpm, and Playwright installed"
  ssh_username            = "ubuntu"
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
  }
}

build {
  name    = "playwright-ami"
  sources = ["source.amazon-ebs.playwright"]

  provisioner "shell" {
    script = "scripts/install_playwright.sh"
  }
}
