resource "aws_location_place_index" "this" {
  data_source = "Esri"
  index_name  = "${var.resource_prefix}-location-place-index"

  data_source_configuration {
    intended_use = "SingleUse"
  }
}
