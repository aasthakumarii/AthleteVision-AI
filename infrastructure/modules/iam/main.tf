resource "aws_iam_role" "ec2_app" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}


resource "aws_iam_role_policy" "s3_access" {
  name = "${var.role_name}-s3-access"
  role = aws_iam_role.ec2_app.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]

        Resource = "${var.s3_bucket_arn}/*"
      },
      {
        Effect = "Allow"

        Action = [
          "s3:ListBucket"
        ]

        Resource = var.s3_bucket_arn
      }
    ]
  })
}


resource "aws_iam_instance_profile" "ec2_app" {
  name = var.role_name
  role = aws_iam_role.ec2_app.name
}