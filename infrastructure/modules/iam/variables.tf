variable "role_name" {
  description = "Name of the IAM role used by the AthleteVision EC2 application"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the AthleteVision S3 bucket"
  type        = string
}