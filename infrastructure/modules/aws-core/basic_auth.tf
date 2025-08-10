resource "random_string" "basic_auth_username" {
  length  = 16
  special = false

}

resource "random_string" "basic_auth_password" {
  length = 16
}
