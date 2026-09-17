module "s3" {
  source = "./modules/s3"

  bucket_name = "athletevision-ai-videos-2026"
}


module "iam" {
  source = "./modules/iam"

  role_name     = "athletevision-ec2-app-role"
  s3_bucket_arn = module.s3.bucket_arn
}


data "aws_vpc" "default" {
  default = true
}


data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}


module "security_group" {
  source = "./modules/security-group"

  name = "athletevision-app-sg"

  vpc_id = data.aws_vpc.default.id

  # Temporary development access.
  # Replace with your own public IP/CIDR before production.
  ssh_cidr = "0.0.0.0/0"

  application_port = 8080
}


module "ec2" {
  source = "./modules/ec2"

  name = "athletevision-app"

  instance_type = "t3.micro"

  subnet_id = data.aws_subnets.default.ids[0]

  security_group_id = module.security_group.security_group_id

  instance_profile_name = module.iam.instance_profile_name

  volume_size = 20
}