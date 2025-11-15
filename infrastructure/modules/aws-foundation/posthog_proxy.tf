resource "aws_cloudfront_cache_policy" "origin_cors" {
  name        = "${var.resource_prefix}-posthog-origin-cors"
  min_ttl     = 0
  default_ttl = 86400
  max_ttl     = 31536000

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Origin", "Authorization"]
      }
    }

    query_strings_config {
      query_string_behavior = "all"
    }

    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

resource "aws_cloudfront_origin_request_policy" "static_assets" {
  name = "${var.resource_prefix}-posthog-static-assets"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = ["Origin"]
    }
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_distribution" "posthog_proxy" {
  enabled = true

  origin {
    domain_name = "${var.posthog_region}.i.posthog.com"
    origin_id   = "posthog-main"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = "${var.posthog_region}-assets.i.posthog.com"
    origin_id   = "posthog-assets"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "posthog-main"
    viewer_protocol_policy = "https-only"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    cache_policy_id            = aws_cloudfront_cache_policy.origin_cors.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.cors_custom_origin.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors_preflight.id
  }

  ordered_cache_behavior {
    path_pattern           = "/static/*"
    target_origin_id       = "posthog-assets"
    viewer_protocol_policy = "https-only"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    cache_policy_id            = aws_cloudfront_cache_policy.origin_cors.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.static_assets.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors_preflight.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.resource_prefix}-posthog-proxy"
  }
}

data "aws_cloudfront_origin_request_policy" "cors_custom_origin" {
  name = "Managed-CORS-CustomOrigin"
}

data "aws_cloudfront_response_headers_policy" "cors_preflight" {
  name = "Managed-CORS-with-preflight-and-SecurityHeadersPolicy"
}
