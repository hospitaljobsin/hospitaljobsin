# Create the S3 Bucket
resource "aws_s3_bucket" "this" {
  bucket_prefix = var.resource_prefix
  tags = {
    Environment = var.environment_name
  }
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


resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


resource "aws_s3_bucket_policy" "my_bucket_policy" {
  bucket = aws_s3_bucket.this.bucket

  depends_on = [aws_s3_bucket_public_access_block.block_public_access]

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.this.arn}/*", # Allow access to all objects within the bucket
      },
    ],
  })
}



# Payload CMS- S3 Bucket (Storage Adapter)
resource "aws_s3_bucket" "cms" {
  bucket_prefix = "${var.resource_prefix}-cms"
  tags = {
    Environment = var.environment_name
  }
}

# Create CORS Configuration for the S3 Bucket
resource "aws_s3_bucket_cors_configuration" "cms" {
  bucket = aws_s3_bucket.cms.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "HEAD", "DELETE"]
    allowed_origins = ["*"] # Change this to specific origins as needed
    expose_headers  = []
    max_age_seconds = 3000
  }
}

# Set bucket ownership controls to allow public access
resource "aws_s3_bucket_ownership_controls" "cms_ownership" {
  bucket = aws_s3_bucket.cms.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Allow public read access via bucket policy
resource "aws_s3_bucket_public_access_block" "block_public_access_cms" {
  bucket                  = aws_s3_bucket.cms.id
  block_public_acls       = false # Block public ACLs (we use bucket policy instead)
  block_public_policy     = false # Allow bucket policies (required for public read)
  ignore_public_acls      = false # Ignore any existing ACLs
  restrict_public_buckets = false # Allow public bucket policies
}

# Bucket policy for public read access
resource "aws_s3_bucket_policy" "cms_bucket_policy" {
  bucket = aws_s3_bucket.cms.bucket

  depends_on = [
    aws_s3_bucket_public_access_block.block_public_access_cms,
    aws_s3_bucket_ownership_controls.cms_ownership
  ]

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.cms.arn}/*",
      },
    ],
  })
}
