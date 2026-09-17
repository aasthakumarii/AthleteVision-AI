output "role_name" {
  description = "Name of the EC2 application IAM role"
  value       = aws_iam_role.ec2_app.name
}

output "role_arn" {
  description = "ARN of the EC2 application IAM role"
  value       = aws_iam_role.ec2_app.arn
}

output "instance_profile_name" {
  description = "Name of the EC2 IAM instance profile"
  value       = aws_iam_instance_profile.ec2_app.name
}

output "instance_profile_arn" {
  description = "ARN of the EC2 IAM instance profile"
  value       = aws_iam_instance_profile.ec2_app.arn
}