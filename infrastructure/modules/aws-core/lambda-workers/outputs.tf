output "worker_function_name" {
  value = aws_lambda_function.worker.function_name
}

output "automation_generate_wa_messages_function_name" {
  value = aws_lambda_function.automation_generate_wa_messages.function_name
}


output "lambda_worker_exec_role_arn" {
  value = aws_iam_role.lambda_worker_exec_role.arn
}

output "lambda_job_alerts_exec_role_arn" {
  value = aws_iam_role.lambda_job_alerts_exec_role.arn
}

output "lambda_staging_db_exec_role_arn" {
  value = aws_iam_role.lambda_staging_db_exec_role.arn
}


output "lambda_exec_role_arn" {
  value = aws_iam_role.lambda_exec_role.arn
}
