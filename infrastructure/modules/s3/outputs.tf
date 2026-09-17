output "bucket_name" {
  description = "Name of the S3 video bucket"
  value       = aws_s3_bucket.videos.bucket
}

output "bucket_arn" {
  description = "ARN of the S3 video bucket"
  value       = aws_s3_bucket.videos.arn
}

output "bucket_id" {
  description = "ID of the S3 video bucket"
  value       = aws_s3_bucket.videos.id
}