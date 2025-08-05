# Google Drive Integration Setup

This guide explains how to set up the Google Drive integration for automatically posting WhatsApp messages as individual files.

## Overview

The Google Drive integration allows the WhatsApp message handler to automatically upload job messages as individual text files to a specified Google Drive folder. This is useful for:

- Archiving job messages for future reference
- Creating a searchable database of job postings
- Sharing job messages with team members
- Backup and compliance purposes

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud Project with the Google Drive API enabled
2. **Service Account or OAuth2**: You can use either a service account or OAuth2 credentials
3. **Google Drive Folder**: A folder in Google Drive where the files will be uploaded

## Setup Instructions

### 1. Enable Google Drive API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Google Drive API" and enable it

### 2. Create Credentials

#### Option A: Service Account (Recommended for Production)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"
6. Click on the created service account
7. Go to the "Keys" tab
8. Click "Add Key" > "Create New Key" > "JSON"
9. Download the JSON file and save it securely

#### Option B: OAuth2 (For Development/Testing)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Desktop application" or "Web application" based on your needs
4. Fill in the required information
5. Download the JSON file

### 3. Configure Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
GOOGLE_DRIVE_CREDENTIALS_FILE=path/to/your/credentials.json
GOOGLE_DRIVE_TOKEN_FILE=path/to/your/token.json
```

### 4. Get Google Drive Folder ID

1. Open Google Drive in your browser
2. Navigate to the folder where you want to upload files
3. The folder ID is in the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
4. Copy the folder ID and set it in `GOOGLE_DRIVE_FOLDER_ID`

### 5. Set Up Credentials File

1. Place your downloaded credentials JSON file in a secure location
2. Update the `GOOGLE_DRIVE_CREDENTIALS_FILE` path in your `.env` file
3. For OAuth2, the first time you run the application, it will open a browser window for authentication

## Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_DRIVE_FOLDER_ID` | ID of the Google Drive folder | Yes | None |
| `GOOGLE_DRIVE_CREDENTIALS_FILE` | Path to credentials JSON file | Yes | None |
| `GOOGLE_DRIVE_TOKEN_FILE` | Path to store OAuth2 token | No | None |
| `GOOGLE_DRIVE_SCOPES` | Google Drive API scopes | No | `["https://www.googleapis.com/auth/drive.file"]` |

### File Naming Convention

The WhatsApp messages are uploaded with the following naming convention:
- Format: `job_message_YYYYMMDD_HHMMSS_N.txt`
- Example: `job_message_20241201_143022_1.txt`

## Testing the Integration

Run the test script to verify the setup:

```bash
cd server
python test_google_drive.py
```

This will test both single file upload and batch upload functionality.

## Usage in WhatsApp Message Handler

The integration is automatically used in the WhatsApp message handler (`wa_message_handler.py`). When the daily cron job runs:

1. It fetches unposted jobs from the database
2. Formats each job as a WhatsApp message
3. Uploads each message as an individual file to Google Drive
4. Marks the jobs as posted to prevent duplicates

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your credentials file path is correct
   - Ensure the Google Drive API is enabled
   - Check that your service account has access to the target folder

2. **Permission Errors**
   - Make sure the service account has write access to the target folder
   - For OAuth2, ensure the user has access to the folder

3. **File Upload Failures**
   - Check the folder ID is correct
   - Verify the folder exists and is accessible
   - Check network connectivity

### Debug Mode

To enable debug logging, set the log level to DEBUG in your environment:

```bash
LOG_LEVEL=DEBUG
```

## Security Considerations

1. **Credentials Security**
   - Store credentials files securely
   - Use environment variables for sensitive data
   - Rotate credentials regularly

2. **Folder Permissions**
   - Use a dedicated folder for uploads
   - Limit access to necessary users only
   - Consider using a service account with minimal permissions

3. **Data Privacy**
   - Ensure job data complies with privacy regulations
   - Consider data retention policies
   - Implement access controls as needed

## Monitoring

The integration logs the following events:
- Successful uploads with file IDs
- Failed uploads with error details
- Batch upload summaries

Check your application logs to monitor the integration status.

## Support

If you encounter issues:

1. Check the application logs for error messages
2. Verify your configuration settings
3. Test with the provided test script
4. Ensure all prerequisites are met
