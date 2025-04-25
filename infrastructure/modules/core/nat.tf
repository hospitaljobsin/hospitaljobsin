# // 1) Allocate a public EIP for your NAT
# resource "aws_eip" "nat" {
#   vpc = true
# }

# // 2) Spin up a tiny Amazon‑Linux instance as NAT
# resource "aws_instance" "nat" {
#   ami                         = data.aws_ami.amazon_linux.id
#   instance_type               = "t3.nano"
#   subnet_id                   = data.aws_subnets.public.ids[0]
#   associate_public_ip_address = true
#   source_dest_check           = false
#   tags = { Name = "${var.resource_prefix}-nat" }
# }

# // 3) Hook your private route table to the NAT
# resource "aws_route" "private_default" {
#   route_table_id         = aws_route_table.private.id
#   destination_cidr_block = "0.0.0.0/0"
#   instance_id            = aws_instance.nat.id
# }
