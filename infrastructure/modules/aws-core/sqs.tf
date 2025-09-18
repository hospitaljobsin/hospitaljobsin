resource "aws_sqs_queue" "this" {
  name                       = "${var.resource_prefix}-queue"
  visibility_timeout_seconds = 60 # ensure this is always greater than or equal to the function timeout
  tags = {
    Environment = var.environment_name
  }
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
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_sqs_queue_redrive_allow_policy" "this" {
  queue_url = aws_sqs_queue.deadletter.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.this.arn]
  })
}


resource "aws_sqs_queue" "job_alerts" {
  name                       = "${var.resource_prefix}-job-alerts-queue"
  visibility_timeout_seconds = 60 # ensure this is always greater than or equal to the function timeout
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_sqs_queue_redrive_policy" "job_alerts" {
  queue_url = aws_sqs_queue.job_alerts.id

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.job_alerts_deadletter.arn
    maxReceiveCount     = 4 # how many times a message can be redriven before it is sent to the dead letter queue
  })
}

resource "aws_sqs_queue" "job_alerts_deadletter" {
  name = "${var.resource_prefix}-job-alerts-deadletter-queue"
  tags = {
    Environment = var.environment_name
  }
}

resource "aws_sqs_queue_redrive_allow_policy" "job_alerts" {
  queue_url = aws_sqs_queue.job_alerts_deadletter.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.job_alerts.arn]
  })
}
