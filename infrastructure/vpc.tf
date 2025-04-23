locals {
  public_subnets = {
    "${var.aws_region}a" = "10.10.101.0/24"
    "${var.aws_region}b" = "10.10.102.0/24"
    "${var.aws_region}c" = "10.10.103.0/24"
  }
  private_subnets = {
    "${var.aws_region}a" = "10.10.201.0/24"
    "${var.aws_region}b" = "10.10.202.0/24"
    "${var.aws_region}c" = "10.10.203.0/24"
  }
}

resource "aws_vpc" "this" {
  cidr_block = "10.10.0.0/16"

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.resource_prefix}-vpc"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.resource_prefix}-internet-gateway"
  }
}

resource "aws_subnet" "public" {
  for_each = local.public_subnets

  cidr_block = each.value
  vpc_id     = aws_vpc.this.id

  map_public_ip_on_launch = true
  availability_zone       = each.key

  tags = {
    Name = "${var.resource_prefix}-public-${each.key}"
  }
}

resource "aws_subnet" "private" {
  for_each = local.private_subnets

  cidr_block = each.value
  vpc_id     = aws_vpc.this.id

  availability_zone = each.key

  tags = {
    Name = "${var.resource_prefix}-service-private-${each.key}"
  }
}

resource "aws_default_route_table" "public" {
  default_route_table_id = aws_vpc.this.main_route_table_id

  tags = {
    Name = "${var.resource_prefix}-public"
  }
}

resource "aws_route" "public_internet_gateway" {
  route_table_id         = aws_default_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id

  timeouts {
    create = "5m"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(keys(local.public_subnets))
  subnet_id      = values(aws_subnet.public)[count.index].id
  route_table_id = aws_default_route_table.public.id
}


resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.resource_prefix}-private"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(keys(local.private_subnets))
  subnet_id      = values(aws_subnet.private)[count.index].id
  route_table_id = aws_route_table.private.id
}


resource "aws_eip" "nat" {
  tags = {
    Name = "${var.resource_prefix}-eip"
  }
}

resource "aws_nat_gateway" "this" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public["${var.aws_region}a"].id

  tags = {
    Name = "${var.resource_prefix}-nat-gw"
  }
}

resource "aws_route" "private_nat_gateway" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.this.id

  timeouts {
    create = "5m"
  }
}

# these resources are not available for tenant/ flex deployments

# resource "aws_vpc_endpoint" "vpce_east" {
#   vpc_id            = aws_vpc.this.id
#   service_name      = mongodbatlas_privatelink_endpoint.pe_east.endpoint_service_name
#   vpc_endpoint_type = "Interface"

#   subnet_ids         = values(aws_subnet.private)[*].id
#   security_group_ids = [aws_security_group.lambda.id]
# }
