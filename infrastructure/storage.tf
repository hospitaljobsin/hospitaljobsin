# Create the S3 Bucket
resource "aws_s3_bucket" "this" {
  bucket = "${var.resource_prefix}-hospitaljobs-default-bucket"
}

# Create CORS Configuration for the S3 Bucket
resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "HEAD"]
    allowed_origins = ["*"] # Change this to specific origins as needed
    expose_headers  = []
    max_age_seconds = 3000
  }
}
