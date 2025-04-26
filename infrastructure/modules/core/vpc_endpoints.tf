# // 1) Gateway endpoint for S3
resource "aws_vpc_endpoint" "s3" {
  vpc_id          = aws_vpc.this.id
  service_name    = "com.amazonaws.${var.aws_region}.s3"
  route_table_ids = aws_route_table.private[*].id
}

# // 2) Interface endpoint for Secrets Manager
# resource "aws_vpc_endpoint" "secretsmanager" {
#   vpc_id            = aws_vpc.this.id
#   service_name      = "com.amazonaws.${var.aws_region}.secretsmanager"
#   subnet_ids        = data.aws_subnets.private.ids
#   security_group_ids = [aws_security_group.lambda.id]
# }

# // 3) Interface endpoint for SES
# resource "aws_vpc_endpoint" "ses" {
#   vpc_id            = aws_vpc.this.id
#   service_name      = "com.amazonaws.${var.aws_region}.email"
#   subnet_ids        = data.aws_subnets.private.ids
#   security_group_ids = [aws_security_group.lambda.id]
# }

# // 4) Interface endpoint for Location Service
# resource "aws_vpc_endpoint" "location" {
#   vpc_id            = aws_vpc.this.id
#   service_name      = "com.amazonaws.${var.aws_region}.geo"
#   subnet_ids        = data.aws_subnets.private.ids
#   security_group_ids = [aws_security_group.lambda.id]
# }
