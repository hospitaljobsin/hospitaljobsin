output "vpc_id" {
  value = aws_vpc.this.id
}

// Fetch private subnets in the VPC

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [aws_vpc.this.id]
  }
  filter {
    name   = "map-public-ip-on-launch"
    values = [false]
  }
}

// Fetch all security groups in the VPC
data "aws_security_groups" "vpc" {
  filter {
    name   = "vpc-id"
    values = [aws_vpc.this.id]
  }
}

output "sst_vpc_private_subnets" {
  # comma‑delimited list
  value = join(",", data.aws_subnets.private.ids)
}

output "sst_vpc_security_groups" {
  value = join(",", data.aws_security_groups.vpc.ids)
}
