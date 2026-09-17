output "s3_bucket_name" {
  description = "Name of the AthleteVision video S3 bucket"
  value       = module.s3.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN of the AthleteVision video S3 bucket"
  value       = module.s3.bucket_arn
}

output "s3_bucket_id" {
  description = "ID of the AthleteVision video S3 bucket"
  value       = module.s3.bucket_id
}


output "iam_role_name" {
  description = "AthleteVision EC2 IAM role name"
  value       = module.iam.role_name
}

output "iam_role_arn" {
  description = "AthleteVision EC2 IAM role ARN"
  value       = module.iam.role_arn
}

output "iam_instance_profile_name" {
  description = "AthleteVision EC2 instance profile name"
  value       = module.iam.instance_profile_name
}

output "iam_instance_profile_arn" {
  description = "AthleteVision EC2 instance profile ARN"
  value       = module.iam.instance_profile_arn
}


output "security_group_id" {
  description = "AthleteVision application security group ID"
  value       = module.security_group.security_group_id
}

output "security_group_name" {
  description = "AthleteVision application security group name"
  value       = module.security_group.security_group_name
}


output "ec2_instance_id" {
  description = "AthleteVision EC2 instance ID"
  value       = module.ec2.instance_id
}

output "ec2_public_ip" {
  description = "AthleteVision EC2 public IP"
  value       = module.ec2.instance_public_ip
}

output "ec2_public_dns" {
  description = "AthleteVision EC2 public DNS"
  value       = module.ec2.instance_public_dns
}

output "ec2_private_ip" {
  description = "AthleteVision EC2 private IP"
  value       = module.ec2.instance_private_ip
}