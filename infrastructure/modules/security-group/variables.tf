variable "name" {
  description = "Name of the application security group"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the security group will be created"
  type        = string
}

variable "ssh_cidr" {
  description = "CIDR allowed to access SSH"
  type        = string
}

variable "application_port" {
  description = "Port exposed by the application"
  type        = number
  default     = 8080
}