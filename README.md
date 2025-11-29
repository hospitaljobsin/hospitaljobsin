# Hospital Jobs

> _recruitment and job seeking for medical professionals_

[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
[![check-runs](https://img.shields.io/github/check-runs/hospitaljobsin/hospitaljobsin/staging?logo=ticktick&logoColor=yellow)](https://github.com/hospitaljobsin/hospitaljobsin/actions)
[![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/hospital-jobs/hospital-jobs)

![Landing Screenshot](./.github/assets/landing-screenshot.png)

## Codebase Structure

![Service Flowchart](./.github/assets/service-flowchart.svg)

<!--
relevant UML code:

https://www.planttext.com?text=u-LoA2v9B2efpStXvShBJqbLK0eepIbE3SylobPmJ4xEByqhALPII2nM20Xtn501bS3K6PIQN5IQMP9Q15KHnCk5nVW0Jx0qa0P90orGqDMr0t4Lh1HAYrEBGM91MCGmX1nIyrB0FW00
-->

| Service                             | Directory                                                    | Description                      |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------------- |
| Hospital Jobs Accounts              | [apps/accounts](./apps/accounts)                             | Authentication/ Accounts UI      |
| Hospital Jobs Recruiter Portal Core | [apps/recruitment-portal-core](./apps/recruiter-portal-core) | Recruitment platform UI          |
| Hospital Jobs Recruiter Dashboard   | [apps/recruitment-dashboard](./apps/recruiter-dashboard)     | Recruitment platform UI          |
| Hospital Jobs                       | [apps/seeker-portal](./apps/seeker-portal)                   | Job Seeker platform UI           |
| Hospital Jobs CMS                   | [apps/cms](./apps/cms)                                       | Payload CMS Dashboard            |
| Hospital Jobs API                   | [server](./server)                                           | GraphQL API Server               |
| E2E Test Suite                      | [e2e](./e2e)                                                 | Playwright End-To-End Tests      |
| Infrastructure                      | [infrastructure](./infrastructure)                           | Terraform Infrastructure as Code |

## System Architecture

![System Architecture](./.github/assets/system_architecture.png)

## License

This project has a proprietary license. Read the entire license [here](./README.md)

## Local development- Quickstart

### Prerequisites

| Tool                                                           | Minimum Tested Version | Description                           |
| -------------------------------------------------------------- | ---------------------- | ------------------------------------- |
| [Docker Engine](https://docs.docker.com/engine/)               | 4.35                   | Container runtime                     |
| [TMUX](https://github.com/tmux/tmux)                           | 3.2a                   | Terminal Multiplexer                  |
| [Tmuxinator](https://github.com/tmuxinator/tmuxinator)         | 3.0                    | TMUX session manager                  |
| [Terraform](https://github.com/hashicorp/terraform)            | v1.12.1                | Infrastructure as Code tool           |
| [Watchman](https://facebook.github.io/watchman/)               | 20250525.093350.0      | File watching service                 |
| [Relay Compiler](https://www.npmjs.com/package/relay-compiler) | 19.0.0                 | GraphQL Codegen Toolkit               |
| [Pre-Commit](https://pre-commit.com/)                          | 4.2.0                  | Git Hooks Framework                   |
| [MKCert](https://mkcert.dev/)                                  | 1.4.4                  | Locally trusted certificate generator |

Go through the setup guides of the services above, which covers installation of required dependencies,
and other service specific setup tasks.

#### 1. Setup Pre-Commit

To set up the git hook scripts, run the following command:

```bash
pre-commit install
```

#### 2. Setup Locally Trusted SSL Certificates

First, create a directory for your certificates and run mkcert to generate them:

```bash
mkcd certs
mkcert -install
mkcert -cert-file ./localtest.me.pem -key-file ./localtest.me-key.pem "localtest.me" "*.localtest.me"
```

This will generate:

- A certificate: `localtest.me.pem`

- A private key: `localtest.me-key.pem`

These are signed by a locally installed Root Certificate Authority (CA).

> ⚠️ Note: While this certificate is trusted within WSL and some development tools, browsers on Windows (Chrome, Edge, Firefox) won’t trust it until the Root CA is added to Windows’ trust store.

To make Windows-based browsers trust the generated certificate:

Open the mkcert CA root directory in Windows File Explorer:

```bash
cd "$(mkcert -CAROOT)"
explorer.exe .
```

- Locate the `rootCA.pem` file (you may need to rename it to `rootCA.crt` for compatibility).
- Double-click the file to open the Certificate Information window.
- Click "Install Certificate…".
- Choose “Local Machine” (requires admin access) or “Current User”.
- Select:
  - Place all certificates in the following store
  - Click Browse
  - Choose Trusted Root Certification Authorities
- Complete the wizard by clicking Next → Finish.
- Restart your browser(s) for the changes to take effect.

#### 3. Run Development Services

To start all services in development, run the following command:

```bash
tmuxinator start medical_jobs
```

### Running E2E tests

1. Stop the currently running services:
   ```bash
   tmuxinator stop medical_jobs
   ```
2. Start the docker compose E2E services:

   ```bash
   docker compose -f docker-compose.e2e.yml up --wait --build --remove-orphans -d
   ```

3. Run the E2E tests:
   ```bash
   pnpm --filter e2e run test
   ```

## Claude Code Setup

This section provides setup instructions for Claude Code's MCP (Model Context Protocol) servers that enhance development productivity.

### Prerequisites

- [Claude Code](https://claude.ai/code) installed and configured
- [Node.js](https://nodejs.org/) (for Context7 MCP)
- [Python](https://python.org/) (for Serena MCP)

### Context7 MCP Setup

Context7 provides up-to-date library documentation and code examples directly within Claude Code.

#### 1. Obtain Context7 API Key

1. Visit [Context7](https://context7.io)
2. Sign up for an account
3. Navigate to your dashboard
4. Generate a new API key
5. Copy the API key for configuration

#### 2. Configure Context7 MCP

Set the `CONTEXT7_API_KEY` env variable in the .env file

### Serena MCP Setup

Serena provides semantic code indexing and retrieval capabilities for efficient code navigation and understanding.

#### 1. Activate and Index the Project

Since the project already exists, activate it and run indexing:

```bash
# Start Claude Code with the new MCP servers
claude

# Within Claude Code, activate the existing project
Activate the project /home/aryaniyaps/web-projects/hospitaljobsin

# Index the project for semantic search
<serena> project index
```

This process will:

- **Project Activation**: Connect Claude Code to your existing project
- **Project Indexing**: Create comprehensive semantic indices for efficient code search and navigation
- **Automatic Onboarding**: Serena performs automatic onboarding on first project startup to:
  - Analyze codebase structure
  - Store project memories in `.serena/memories/` for improved future interactions
  - Set up symbol relationships and cross-references
- **Continuous Updates**: Regular usage automatically updates the index to reflect code changes

**Note**: The indexing command should be run once after project activation. Subsequent code changes will be automatically incorporated into the index.

### Verification

To verify both MCP servers are working correctly:

1. **Test Context7**:

   ```bash
   # In Claude Code, ask for library documentation
   "Show me React Router v6 documentation for route protection"
   ```

2. **Test Serena**:
   ```bash
   # In Claude Code, ask for code analysis
   "Find all authentication-related components in the seeker portal"
   ```

### Troubleshooting

#### Common Issues

1. **MCP servers not loading**:

   - Check your MCP configuration file syntax
   - Ensure API keys are correctly set
   - Verify the servers are installed correctly

2. **Serena indexing issues**:

   - Ensure the project path is correct
   - Check file permissions for the project directory
   - Run onboarding again if project structure changes significantly

3. **Context7 API errors**:
   - Verify your API key is valid and active
   - Check your internet connection
   - Ensure Context7 service is available

#### Configuration File Location

MCP configuration is typically stored at:

- **macOS/Linux**: `~/.config/claude/mcp-servers.json`
- **Windows**: `%APPDATA%\Claude\mcp-servers.json`

#### Getting Help

- Context7 documentation: [Context7 Documentation](https://docs.context7.io)
- Serena MCP repository: [Serena MCP GitHub](https://github.com/serena-mcp/serena-mcp)
- Claude Code documentation: [Claude Code Help](https://docs.anthropic.com/claude/docs/claude-code)

### Usage Examples

Once set up, you can use these powerful features:

```bash
# Get library documentation automatically
"How do I implement form validation with React Hook Form and Zod?"

# Perform semantic code searches
"Show me all GraphQL mutations related to job applications"

# Understand code relationships
"What components depend on the authentication service?"

# Get contextual code examples
"Show me how to implement a pagination component using HeroUI"
```

## Cloud deployment

Follow these steps to deploy the project to the cloud:

### 1. MongoDB Atlas Setup

- [Install the MongoDB Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/install-atlas-cli/)
- Setup Payment Method
- Copy the MongoDB Organization ID from the dashboard and store it in environment variables
- Run the follow commands to generate API keys:
  ```bash
  atlas organizations apiKeys create --role ORG_OWNER --desc "My API Key" --orgId <ORG_ID> --output json
  ```

### 2. AWS Account Setup

- [Log in to the AWS Management Console](https://console.aws.amazon.com/)
- Create a new AWS account/ log into an existing account
- Create a new IAM user (to be used by terraform)
- Add the `"arn:aws:iam::aws:policy/AdministratorAccess"` managed IAM policy to the user

<!--
- Attach the following permissions (inline policy) to the IAM user:
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"ecr:*",
				"logs:*",
				"acm:DeleteCertificate",
				"sts:GetCallerIdentity",
				"iam:ListInstanceProfilesForRole",
				"iam:CreateRole",
				"iam:GetRole",
				"iam:ListRolePolicies",
				"iam:ListAttachedRolePolicies",
				"iam:ListPolicyVersions",
				"iam:AttachRolePolicy",
				"iam:DeleteRole",
				"iam:PassRole",
				"iam:CreateUser",
				"iam:TagUser",
				"iam:CreatePolicyVersion",
				"iam:CreatePolicy",
				"iam:GetUser",
				"iam:DeleteUser",
				"iam:DeletePolicy",
				"iam:TagPolicy",
				"iam:ListGroupsForUser",
				"iam:ListAttachedUserPolicies",
				"iam:ListAccessKeys",
				"iam:CreateAccessKey",
				"iam:AttachUserPolicy",
				"iam:GetPolicy",
				"iam:GetPolicyVersion",
				"iam:PutRolePolicy",
				"iam:GetRolePolicy",
				"iam:DeleteRolePolicy",
				"iam:DetachUserPolicy",
				"iam:CreateServiceLinkedRole",
				"ses:*",
				"secretsmanager:*",
				"s3:*",
				"geo:CreatePlaceIndex",
				"geo:DeletePlaceIndex",
				"geo:DescribePlaceIndex",
				"acm:RequestCertificate",
				"acm:DescribeCertificate",
				"acm:ListTagsForCertificate",
				"lambda:*",
				"ec2:*",
				"route53:CreateHostedZone",
				"route53:GetHostedZone",
				"route53:ListTagsForResource",
				"route53:ListResourceRecordSets",
				"route53:ChangeResourceRecordSets",
				"route53:GetChange",
				"route53:DeleteHostedZone",
				"route53:ChangeTagsForResource",
				"apigateway:*",
				"cloudfront:UpdateDistribution"
			],
			"Resource": "*"
		}
	]
}
``` -->

- Create Access Keys for the user (choose access key for CLI, SDK, & API access)

### 3. Google Oauth2 Setup

- [Go to the google cloud console](https://console.cloud.google.com/)
- Create/ select a new project
- Configure the Oauth consent screen
- Go to "APIs & Services" > "Credentials", and create new Oauth 2.0 Credentials
- While creating the credentials, fill in the following information:

  - **Client config:**

    - _Authorized Javascript origins:_
      - https://accounts.hospitaljobs.in
      - https://hospitaljobs.in
    - _Authorized Redirect URIs:_
      - https://api.hospitaljobs.in/auth/callback/signin/google
      - https://api.hospitaljobs.in/auth/callback/request_sudo_mode/google

  - **Project Branding config:**

    - _App name:_ Hospital Jobs
    - _App Domain:_
      - _Application home page:_ https://hospitaljobs.in
      - _Application privacy policy link:_ https://hospitaljobs.in/privacy
      - _Application terms of service link:_ https://hospitaljobs.in/terms
    - _Authorized domains:_
      - hospitaljobs.in

  - **OAuth Consent Screen Configuration:**
    - Under "Scopes", add the following scope:
      - `https://www.googleapis.com/auth/user.phonenumbers.read`
    - Request verification for your OAuth app to ensure compliance with Google's policies

### 4. Cloudflare Setup

- [Go to the Cloudflare dashboard](https://dash.cloudflare.com/)
- Login to your cloudflare account
- Under Manage Account / Account tokens, click on "Create Token"

### 5. GitHub Setup

- [Go to GitHub developer settings](https://github.com/settings/tokens)
- Create a new GitHub access token with permissions for the current repository:
  - _secrets: read and write_
  - _variables: read and write_
  - _administration: read and write_

### 6. Sentry Setup

- Create a new organization
- [Install the Sentry GitHub Integration](https://docs.sentry.io/organization/integrations/source-code-mgmt/github/#installing-github) (repository linking is automated)
- [Create a Sentry Authentication Token](https://docs.sentry.io/organization/integrations/integration-platform/internal-integration/#auth-tokens) (via an internal integration)

### 7. Redis Cloud Setup

- Go to the [Redis Cloud Console](https://console.redis.io)
- Configure a payment method
- Enable programmatic access to the cloud console (Under Access Management > API Keys)
- Create an API key (AKA Secret Key)
- Copy the Account Key (AKA Access Key) and API Key (AKA Secret Key)

### 8. PostHog Setup

- Go to the [PostHog Console](https://app.posthog.com)
- Create a new project
- Copy the project API key and host

### 9. Whatsapp Business Setup

To set up a WhatsApp Business API account using Meta's developer tools, follow these updated instructions based on the latest Meta documentation. The process involves creating a Meta Developer Account, setting up a WhatsApp Business Account, and configuring the necessary components for API access.

1. **Create a Meta Developer Account**

   - Visit the [Meta for Developers](https://developers.facebook.com/) website.
   - Sign in with your Facebook account or create a new one. If you don’t have a Facebook account, you’ll need to create one.
   - Once logged in, register as a developer by following the prompts to set up your Meta Developer Account.

2. **Access the Meta Business Manager**

   - Go to [Meta Business Manager](https://business.facebook.com).
   - If you don’t have a Business Manager account, click **Create Account** and follow the steps to set up a new business account.
   - Provide the required business details (e.g., business name, address, and contact information).
   - Once created, note down the **Business Manager ID** (found in the Business Settings under **Business Info**).

3. **Create a System User in Business Manager**

   - In the Meta Business Manager, navigate to **Settings** > **Business Settings** > **Users** > **System Users**.
   - Click **Add** to create a new system user.
   - Assign a name to the system user and select the **Admin** role for full access to WhatsApp-related assets.
   - Save the system user and generate an access token later in the process.

4. **Create a New Meta App in the Developer Portal**

   - Go to the [Meta for Developers](https://developers.facebook.com/apps/) portal.
   - Click **Create App**, select **Business** as the app type, and provide the required details (e.g., app name and contact email).
   - Once the app is created, go to the app’s dashboard and add the **WhatsApp** product by clicking **Set Up** under the WhatsApp option.

5. **Assign the App to the System User and Generate an Access Token**

   - In Business Manager, go to **Settings** > **Business Settings** > **Users** > **System Users**.
   - Select the system user created in Step 3.
   - Click **Assign Assets**, choose the app created in Step 4, and assign the appropriate permissions (e.g., **Manage App**).
   - Click **Generate New Token**, select the app, and ensure all WhatsApp-related permissions are enabled (e.g., `whatsapp_business_management`, `whatsapp_business_messaging`).
   - Copy the **System User Access Token** and store it securely, as it will be used for API authentication.

6. **Set Up a WhatsApp Business Account**

   - In the Meta Business Manager, navigate to **Settings** > **Business Settings** > **Accounts** > **WhatsApp Accounts**.
   - Click **Add** to create a new WhatsApp Business Account.
   - Follow the prompts to link it to your Business Manager account. This may involve verifying your business details.

7. **Add a Phone Number to the WhatsApp Business Account**

   - In the WhatsApp Accounts section of Business Manager, select the newly created WhatsApp Business Account.
   - Click **Add Phone Number** and provide a phone number that hasn’t been used with WhatsApp before (it cannot be linked to an existing WhatsApp account).
   - Verify the phone number via SMS or voice call as prompted.
   - Configure the phone number settings, such as the display name and business profile details, following Meta’s guidelines.

8. **Obtain the WhatsApp Business Phone Number ID**
   - Once the phone number is added and verified, go to **Settings** > **Business Settings** > **Accounts** > **WhatsApp Accounts**.
   - Select the WhatsApp Business Account and locate the **Phone Number ID** (also called the WhatsApp Business Phone Number ID).
   - Copy the **Phone Number ID** for use in API requests.

### 10. Facebook Jobs Partner Application Setup

To enable automatic job posting to Facebook Jobs platform, you need to apply for and configure the Jobs on Facebook Partner Application. This creates structured job postings that appear in Facebook's job ecosystem, not regular page posts.

1. **Create a Meta Developer Account**

   - Visit the [Meta for Developers](https://developers.facebook.com/) website
   - Sign in with your Facebook account or create a new one
   - Register as a developer by following the prompts to set up your Meta Developer Account

2. **Create a New Facebook App**

   - Go to the [Meta for Developers Apps page](https://developers.facebook.com/apps)
   - Click **Create App**
   - Select **Business** as the app type
   - Fill in the required details:
     - **App Name**: "Hospital Jobs Integration" (or your preferred name)
     - **App Contact Email**: Your email address
     - **Business Manager**: Select your existing business account or create a new one
   - Click **Create App**

3. **Apply for Jobs on Facebook Partner Program**

   - Visit the [Jobs on Facebook Partner Program](https://developers.facebook.com/docs/jobs/)
   - Click **Apply to Become a Partner**
   - Fill out the partnership application with:
     - **Company Information**: Your business details and website
     - **Integration Type**: Select "Job Board" or "ATS"
     - **Technical Capabilities**: Describe your job posting system
     - **Volume Estimates**: Expected number of job postings per month
     - **Compliance**: Confirm you understand Jobs on Facebook policies

4. **Add Jobs Product to Your App**

   Once approved:
   - Go to your App Dashboard
   - Click **Add Product** > **Jobs**
   - Follow the setup wizard for Jobs integration
   - Configure your job posting workflow

5. **Configure App Permissions**

   - Go to **App Review** > **Permissions and Features**
   - Add the following permissions:
     - `jobs_manage` - To create and manage job postings
     - `jobs_read` - To read job posting data
     - `pages_read_engagement` - To read page engagement metrics
   - Click **Request Review** for each permission

6. **Create System User Access Token**

   - In Business Manager, go to **Settings** > **Business Settings** > **Users** > **System Users**
   - Create a new System User with **Admin** role
   - Assign your app to the System User
   - Generate a **long-lived access token** with Jobs permissions:
     - `jobs_manage`
     - `jobs_read`
     - `pages_read_engagement`

7. **Get App Credentials**

   - In your app dashboard, go to **Settings** > **Basic**
   - Copy the **App ID** and **App Secret**
   - **Important**: Keep your App Secret secure and never expose it in client-side code

8. **Set Up Webhook (Optional)**

   For real-time updates on job applications:
   - Go to your App Dashboard > **Jobs** > **Webhooks**
   - Configure webhook URL to receive application notifications
   - Subscribe to `jobs_applied` events

9. **Test the Configuration**

   - Use the Graph API Explorer to test creating a job posting:
     ```
     POST /me/jobs
     title="Senior Nurse"
     description="We are looking for experienced nurses..."
     location="{
       'city': 'Mumbai',
       'country': 'India'
     }"
     employment_type="FULL_TIME"
     application_url="https://hospitaljobs.in/jobs/123"
     ```
   - You should see the job appear in Facebook Jobs interface

10. **Store Your Credentials Securely**

    You now have all the required values:
    - **App ID** (`SERVER_FACEBOOK_APP_ID`)
    - **App Secret** (`SERVER_FACEBOOK_APP_SECRET`)
    - **System User Access Token** (`SERVER_FACEBOOK_JOBS_ACCESS_TOKEN`)

    Store these values in your environment variables and AWS Secrets Manager.

11. **Environment Variables**

    Add these to your `.env` file and AWS Secrets Manager:

    **Public Variables (can be GitHub Actions variables):**
    ```bash
    SERVER_FACEBOOK_APP_ID="your-facebook-app-id"
    ```

    **Secret Variables (must be GitHub Actions secrets):**
    ```bash
    SERVER_FACEBOOK_APP_SECRET="your-facebook-app-secret"
    SERVER_FACEBOOK_JOBS_ACCESS_TOKEN="your-long-lived-system-user-token"
    ```

12. **Important Notes**

    - **Partner Approval**: You must be approved for the Jobs on Facebook Partner Program before posting jobs
    - **Job Format**: Jobs must comply with Facebook's structured job posting format and policies
    - **Application Tracking**: Set up application URLs to track applicants from Facebook
    - **Compliance**: Ensure job postings comply with equal employment opportunity laws
    - **Rate Limits**: Jobs API has specific rate limits for posting and updating jobs
    - **Testing**: Test thoroughly with the Graph API Explorer before implementing automated posting

The system will now automatically:
- Post new jobs to Facebook Jobs platform 4 times daily (01:00, 07:00, 13:00, 19:00 UTC)
- Create structured job postings with proper job metadata
- Update existing job postings when they change
- Expire/close job postings when jobs are no longer active
- Handle errors gracefully and provide detailed logging
- Track applications through your application URLs

### 11. Two Factor IN Setup

- Go to the [Two Factor IN Console](https://2factor.in)
- Create a new account
- Copy the API key

### 12. Payload CMS Setup

- TODO

### 13. Google Indexing Setup

To enable programmatic submission of URLs to Google Search for indexing, you need to set up a Google Cloud service account with the Indexing API enabled.

1. **Create a Google Cloud Project**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note down the **Project ID** for later use

2. **Enable the Indexing API**

   - In the Google Cloud Console, navigate to **APIs & Services** > **Library**
   - Search for "Indexing API"
   - Click on **Web Search Indexing API** (or **Indexing API**)
   - Click **Enable** to activate the API for your project

3. **Create a Service Account**

   - Navigate to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **Service Account**
   - Provide a service account name (e.g., "google-indexing-service")
   - Optionally add a description (e.g., "Service account for programmatic URL indexing")
   - Click **Create and Continue**
   - Skip the optional "Grant this service account access to project" step by clicking **Continue**
   - Skip the optional "Grant users access to this service account" step by clicking **Done**

4. **Generate Service Account Key (JSON)**

   - In the **Credentials** page, locate your newly created service account under **Service Accounts**
   - Click on the service account email to open its details
   - Navigate to the **Keys** tab
   - Click **Add Key** > **Create new key**
   - Select **JSON** as the key type
   - Click **Create** - this will download a JSON file containing your service account credentials
   - **Store this JSON file securely** - it contains sensitive credentials that grant API access
   - Note the service account email address (format: `service-account-name@project-id.iam.gserviceaccount.com`)

5. **Add Service Account to Google Search Console**

   - Go to [Google Search Console](https://search.google.com/search-console)
   - Select your property (e.g., `https://hospitaljobs.in`)
   - If you haven't added your property yet:
     - Click **Add Property**
     - Choose **URL prefix** and enter your domain (e.g., `https://hospitaljobs.in`)
     - Verify ownership using one of the provided methods (DNS record, HTML file upload, HTML tag, Google Analytics, or Google Tag Manager)
   - Once your property is verified, navigate to **Settings** (gear icon in the left sidebar)
   - Click on **Users and permissions**
   - Click **Add user**
   - Enter the **service account email address** (from Step 4)
   - Select **Owner** as the permission level (required for Indexing API access)
   - Click **Add**

6. **Verify API Access**

   - You can test the setup by making a test API call using the service account credentials
   - The service account can now submit URL indexing requests via the Google Indexing API
   - Copy the JSON credentials

### 14. Bing IndexNow Setup

To enable instant URL submission to Bing and other participating search engines using the IndexNow protocol, you need to generate an API key.

- Generate a unique API key (a random string of characters, typically 32+ characters)
- You can use any method to generate a secure random string, for example:
  - Directly from Bing Webmaster Dashboard
  - Online UUID generator
  - Command line: `openssl rand -hex 32`
  - Or use any cryptographically secure random string generator
- Copy and securely store the generated API key

### 15. Terraform Setup

#### 15.1 Prerequisites:

- Create an S3 bucket that will act as the terraform state backend

Terraform deployments are automated via GitHub Actions CI/CD.
the following GitHub actions variables and secrets need to be set to enable deployments:

GitHub Actions Variables:

- `TERRAFORM_AWS_BACKEND_BUCKET_NAME`
- `TERRAFORM_AWS_REGION`
- `CLOUDFLARE_ACCOUNT_ID`
- `MONGODB_ATLAS_ORG_ID`
- `WHATSAPP_PHONE_NUMBER_ID`
- `POSTHOG_HOST`
- `FACEBOOK_PAGE_ID`
- `FACEBOOK_APP_ID`

GitHub Actions Secrets:

- `TERRAFORM_AWS_ACCESS_KEY_ID`
- `TERRAFORM_AWS_SECRET_ACCESS_KEY`
- `CLOUDFLARE_API_TOKEN`
- `PA_TOKEN_GITHUB`
- `MONGODB_ATLAS_PRIVATE_KEY`
- `MONGODB_ATLAS_PUBLIC_KEY`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `SENTRY_AUTH_TOKEN`
- `REDISCLOUD_SECRET_KEY`
- `REDISCLOUD_ACCESS_KEY`
- `WHATSAPP_ACCESS_TOKEN`
- `TWO_FACTOR_IN_API_KEY`
- `POSTHOG_API_KEY`
- `GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON`
- `BING_INDEXNOW_API_KEY`
- `FACEBOOK_APP_SECRET`
- `FACEBOOK_JOBS_ACCESS_TOKEN`


During the initial terraform deployment:

- update the domain registrar (GoDaddy/ NameCheap/ Google Domains)'s NS records to the Route 53 nameservers midway, to ensure certificate validation takes place

After automated deployment, you need to:

- Request SES production access manually on AWS
- Join the created team on sentry with your account
- Grant access to the following Models in AWS Bedrock:
  - Amazon Nova Micro V1
  - Amazon Nova Lite V1
  - Amazon Nova Pro V1
  - Amazon Titan Text Embeddings V2
