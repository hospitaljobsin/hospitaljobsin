resource "aws_location_place_index" "single_use" {
  data_source = "Esri"
  index_name  = "${var.resource_prefix}-singleuse-place-index"

  data_source_configuration {
    intended_use = "SingleUse"
  }
}


resource "aws_location_place_index" "storage" {
  data_source = "Esri"
  index_name  = "${var.resource_prefix}-storage-place-index"

  data_source_configuration {
    intended_use = "Storage"
  }
}
