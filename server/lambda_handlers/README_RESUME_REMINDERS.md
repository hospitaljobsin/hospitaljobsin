# Resume Upload Reminder System

## Overview
Automated email reminders sent to users who haven't uploaded their resume within 7 days of account creation.

## How It Works

### Lambda Handler
**File:** `lambda_handlers/send_resume_upload_reminders.py`

**Logic:**
1. Queries accounts created in the last 7 days
2. Filters out users who already have a resume uploaded
3. Sends personalized email reminders with UTM tracking
4. Logs success/failure for monitoring

### Email Template
**Location:** `templates/emails/resume-upload-reminder/`

**Features:**
- Personalized greeting with user's name
- Visual illustration
- Clear value proposition (AI-powered job matching)
- Three key benefits in a grid layout
- Full-width CTA button
- UTM tracking for PostHog analytics

## Recommended Schedule

### Option 1: Daily (Recommended)
**Frequency:** Once per day at 10 AM UTC
**AWS EventBridge Rule:**
```
cron(0 10 * * ? *)
```
**Pros:** Catches users quickly, better engagement
**Cons:** More Lambda invocations

### Option 2: Every 3 Days
**Frequency:** Every 3 days at 10 AM UTC
**AWS EventBridge Rule:**
```
cron(0 10 */3 * ? *)
```
**Pros:** Balanced approach, less frequent
**Cons:** Some users might wait longer

### Option 3: Weekly
**Frequency:** Every Monday at 10 AM UTC
**AWS EventBridge Rule:**
```
cron(0 10 ? * MON *)
```
**Pros:** Minimal Lambda costs
**Cons:** Users might lose interest

## AWS Setup

### 1. Deploy Lambda Function
The Lambda function should be deployed via your Terraform infrastructure with:
- Runtime: Python 3.12+
- Timeout: 5 minutes
- Memory: 512 MB
- Environment variables from your existing setup

### 2. Create EventBridge Rule
```hcl
resource "aws_cloudwatch_event_rule" "resume_upload_reminder" {
  name                = "resume-upload-reminder-daily"
  description         = "Trigger resume upload reminders daily"
  schedule_expression = "cron(0 10 * * ? *)"
}

resource "aws_cloudwatch_event_target" "resume_upload_reminder" {
  rule      = aws_cloudwatch_event_rule.resume_upload_reminder.name
  target_id = "ResumUploadReminderLambda"
  arn       = aws_lambda_function.send_resume_upload_reminders.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.send_resume_upload_reminders.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.resume_upload_reminder.arn
}
```

### 3. Monitor with CloudWatch
Key metrics to track:
- Lambda invocations
- Execution duration
- Error rate
- Custom logs: `sent_count` and `skipped_count`

## PostHog Tracking

UTM parameters included in email links:
- `utm_source=email`
- `utm_medium=email`
- `utm_campaign=resume_upload_reminder`

Track these events in PostHog:
- Email sent (from Lambda logs)
- Link clicked (from UTM parameters)
- Resume uploaded (conversion event)

## Cost Estimation

**Daily schedule:**
- ~30 Lambda invocations/month (assuming some days have no new users)
- ~1-2 minutes execution time per run
- Estimated cost: < $1/month

**Email costs (AWS SES):**
- $0.10 per 1,000 emails
- Assuming 100 new users/day without resumes: ~3,000 emails/month
- Estimated cost: ~$0.30/month

**Total: < $2/month**

## Testing Locally

```bash
cd server
uv run python -m lambda_handlers.send_resume_upload_reminders
```

## Future Improvements

1. **Smart Timing:** Send at optimal times based on user timezone
2. **A/B Testing:** Test different subject lines and content
3. **Follow-up:** Send a second reminder after 14 days if still no resume
4. **Segmentation:** Different messaging for different user types
5. **Rate Limiting:** Ensure we don't send too many emails at once
