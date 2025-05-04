# Future- TODO
(UX)
- we cannot be generating metadata in some pages (like org detail members page) because outer layouts are client components. we need to try and make sure that the outer layouts are a server component
- fix invariant errors that blow up in prod (fix is to wrap components that call useLazyLoadQuery with suspense)
	- we also need to use usePreloadedQuery instead os useLazyLoadQuery- this will avoid timing issues and hence invariant blowing up
- update skeleton UIs (landing page and org list skeletons are outdated)
- fix cloudflare turnstile- captcha token refreshing is not working, and calling execute/refresh manually takes some time and affects UX
- when certain non required fields are touched, they become invalid. even when the field is cleared, users are unable to submit forms. need to fix this
- fix google oauth2 internal server error in prod
- make language proficiency a dropdown
- allow optional radio groups to be unselected- possibly convert them into select components (job type, work mode in create job form)
- fix location autocomplete- the selected location disappears when no results are found
	(root cause is ID changes when the results are fetched the second time- as we are using a random ID generator- nanoid() for the places)

(features)
- ensure members can also create jobs, but they can only view and manage jobs they own.
- ensure admins can view and edit all jobs, though.
- add export applicants to XLSX button
- add select option type applicant field
- add pagination to job view metrics (normal connections should be enough??)

- we need a separate resource that can return the searched jobs

- if prompt is show me jobs satisfying XXX conditions, we get a tool call done to call the appropriate jobs. we handle that and show the result client side.
- we can add other tools too, like showing current applications, saved jobs etc

# Hospital Jobs
> *recruitment and job seeking for medical professionals*

## Codebase Structure

![Service Flowchart](./.github/assets/service-flowchart.png)

<!-- 
relevant UML code:

https://www.planttext.com?text=u-LoA2v9B2efpStXvShBJqbLK0eepIbE3SylobPmJ4xEByqhALPII2nM20Xtn501bS3K6PIQN5IQMP9Q15KHnCk5nVW0Jx0qa0P90orGqDMr0t4Lh1HAYrEBGM91MCGmX1nIyrB0FW00
-->

| Service                 | Directory                                         | Description                      |
|-------------------------|---------------------------------------------------|----------------------------------|
| Hospital Jobs Accounts  | [apps/accounts](./apps/accounts)                  | Authentication/ Accounts UI      |
| Hospital Jobs Recruiter | [apps/recruitment-portal](./apps/recruiter-portal)| Recruitment platform UI          |
| Hospital Jobs           | [apps/seeker-portal](./apps/seeker-portal)        | Job Seeker platform UI           |
| Hospital Jobs API       | [server](./server)                                | GraphQL API Server               |
| E2E Test Suite          | [e2e](./e2e)                                      | Playwright End-To-End Tests      |
| Infrastructure          | [infrastructure](./infrastructure)                | Terraform Infrastructure as Code |


## License
This project has a proprietary license. Read the entire license [here](./README.md)


## Local development- Quickstart

### Prerequisites
| Tool                                                       | Minimum Tested Version  | Description                 |
|------------------------------------------------------------|-------------------------|-----------------------------|
| [Docker Engine](https://docs.docker.com/engine/)           | 4.35                    | Container runtime           |
| [TMUX](https://github.com/tmux/tmux)                       | 3.2a                    | Terminal Multiplexer        |
| [Tmuxinator](https://github.com/tmuxinator/tmuxinator)     | 3.0                     | TMUX session manager        |

Go through the setup guides of the services above, which covers installation of required dependencies,
and other service specific setup tasks.

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
    cd e2e
    pnpm run test
    ```


## Cloud deployment

Follow these steps to deploy the project to the cloud:

1. MongoDB Setup
- [Install the MongoDB Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/install-atlas-cli/)
- Copy the MongoDB Organization ID from the dashboard and store it in environment variables
- Run the follow commands to generate API keys:
    ```bash
    atlas organizations apiKeys create --role ORG_OWNER --desc "My API Key" --orgId <ORG_ID> --output json
    ```

2. AWS Account Setup
- [Log in to the AWS Management Console](https://console.aws.amazon.com/)
- Create a new AWS account/ log into an existing account
- Create a new IAM user (to be used by terraform)
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
```

- Create Access Keys for the user (choose  access key for CLI, SDK, & API access)

3. Google Oauth2 Setup
- [Go to the google cloud console](https://console.cloud.google.com/)
- Create/ select a new project
- Configure the Oauth consent screen
- Go to "APIs & Services" > "Credentials", and create new Oauth 2.0 Credentials
- While creating the credentials, fill in the following information:
	- Client config:
		- Authorized Javascript origins:
			- https://accounts.hospitaljobs.in
		- Authorized Redirect URIs:
			- https://api.hospitaljobs.in/auth/callback/signin/google
			- https://api.hospitaljobs.in/auth/callback/request_sudo_mode/google

	- Project Branding config:
		- App name: Hospital Jobs
		- App Domain:
			- Application home page: https://hospitaljobs.in
			- Application privacy policy link: https://hospitaljobs.in/privacy
			- Application terms of service link: https://hospitaljobs.in/terms
		- Authorized domains:
			- hospitaljobs.in

4. Cloudflare setup
- [Go to the Cloudflare dashboard](https://dash.cloudflare.com/)
- Login to your cloudflare account
- Under Manage Account / Account tokens, click on "Create Token"

5. GitHub setup
- Go to developer settings
- Create a new GitHub access token with permissions for the current repository:
	- *secrets: read and write*
	- *variables: read and write*

6. Terraform setup

6.1 Prerequisites:
- Create an S3 bucket that will act as the terraform state backend

Terraform deployments are automated via GitHub Actions CI/CD.
the following GitHub actions variables and secrets need to be set to enable deployments:

GitHub Actions Variables:
- `TERRAFORM_AWS_BACKEND_BUCKET_NAME`
- `TERRAFORM_AWS_REGION`
- `CLOUDFLARE_ACCOUNT_ID`
- `MONGODB_ATLAS_ORG_ID`
- `SUPPORT_EMAIL`

GitHub Actions Secrets:
- `TERRAFORM_AWS_ACCESS_KEY_ID`
- `TERRAFORM_AWS_SECRET_ACCESS_KEY`
- `CLOUDFLARE_API_TOKEN`
- `PA_TOKEN_GITHUB`
- `MONGODB_ATLAS_PRIVATE_KEY`
- `MONGODB_ATLAS_PUBLIC_KEY`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`

- Trigger the GitHub actions workflow.
- During the initial terraform deployment:
	- update the domain registrar (GoDaddy/ NameCheap/ Google Domains)'s NS records to the Route 53 nameservers midway, to ensure certificate validation takes place

After automated deployment, you need to:
- Request SES production access manually

## TODO: infrastructure
- wait for relevant tests to pass before building and pushing
- move lambda functions inside VPCs and assign internet gateway endpoints to VPCs