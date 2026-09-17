output "security_group_id" {
  description = "Application security group ID"
  value       = aws_security_group.app.id
}

output "security_group_name" {
  description = "Application security group name"
  value       = aws_security_group.app.name
}