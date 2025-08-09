output "turnstile_widget_secret" {
  value     = cloudflare_turnstile_widget.example.secret
  sensitive = true
}

output "sst_captcha_site_key" {
  value = cloudflare_turnstile_widget.example.id
}
