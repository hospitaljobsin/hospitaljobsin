resource "aws_sqs_queue" "this" {
  name                       = "${var.resource_prefix}-queue"
  visibility_timeout_seconds = 60 # ensure this is always greater than or equal to the function timeout
}

resource "aws_sqs_queue_redrive_policy" "this" {
  queue_url = aws_sqs_queue.this.id
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter.arn
    maxReceiveCount     = 4 # how many times a message can be redriven before it is sent to the dead letter queue
  })
}

resource "aws_sqs_queue" "deadletter" {
  name = "${var.resource_prefix}-deadletter-queue"
}

resource "aws_sqs_queue_redrive_allow_policy" "this" {
  queue_url = aws_sqs_queue.deadletter.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.this.arn]
  })
}
