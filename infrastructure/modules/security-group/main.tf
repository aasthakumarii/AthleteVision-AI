resource "aws_security_group" "app" {
  name        = var.name
  description = "Security group for AthleteVision application EC2"
  vpc_id      = var.vpc_id

  tags = {
    Name        = var.name
    Project     = "AthleteVision"
    Environment = "dev"
  }
}


resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.app.id

  cidr_ipv4   = var.ssh_cidr
  from_port   = 22
  to_port     = 22
  ip_protocol = "tcp"

  description = "SSH access"
}


resource "aws_vpc_security_group_ingress_rule" "application" {
  security_group_id = aws_security_group.app.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = var.application_port
  to_port     = var.application_port
  ip_protocol = "tcp"

  description = "AthleteVision application traffic"
}


resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.app.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow outbound traffic"
}