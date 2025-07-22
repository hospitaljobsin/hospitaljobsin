// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />
const { env } = await import("./lib/env/client");

export default $config({
	app(input) {
		return {
			name: "recruiter-dashboard",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		// const privateSubnets = process.env.SST_VPC_PRIVATE_SUBNETS?.split(",") || [];
		// const securityGroups = process.env.SST_VPC_SECURITY_GROUPS?.split(",") || [];
		new sst.aws.Nextjs("recruiter-dashboard-ui", {
			buildCommand: "pnpm run package",
			domain: {
				name: "wildcard.hospitaljobs.in",
				aliases: [process.env.SST_RECRUITER_DASHBOARD_DOMAIN],
			},
			environment: {
				NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
				NEXT_PUBLIC_URL: env.NEXT_PUBLIC_URL,
				// NEXT_PUBLIC_CAPTCHA_SITE_KEY: env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
				NEXT_PUBLIC_ACCOUNTS_BASE_URL: env.NEXT_PUBLIC_ACCOUNTS_BASE_URL,
				NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL:
					env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL,
				NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL:
					env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL,
				NEXT_PUBLIC_SESSION_COOKIE_KEY: env.NEXT_PUBLIC_SESSION_COOKIE_KEY,
				NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
				NEXT_PUBLIC_SENTRY_ORGANIZATION: env.NEXT_PUBLIC_SENTRY_ORGANIZATION,
				NEXT_PUBLIC_SENTRY_PROJECT: env.NEXT_PUBLIC_SENTRY_PROJECT,
				NEXT_PUBLIC_ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT,
				NEXT_PUBLIC_ROOT_DOMAIN: env.NEXT_PUBLIC_ROOT_DOMAIN,
				AWS_SECRET_ID: process.env.AWS_SECRET_ID,
				NEXT_PUBLIC_INTERNAL_API_URL: env.NEXT_PUBLIC_INTERNAL_API_URL,
			},
			assets: {
				textEncoding: "utf-8",
				versionedFilesCacheHeader: "public,max-age=31536000,immutable",
				nonVersionedFilesCacheHeader:
					"public,max-age=0,s-maxage=86400,stale-while-revalidate=8640",
				fileOptions: [
					{
						// Cache JS/CSS chunks forever
						files: [
							"**/*.js",
							"**/*.css",
							"**/*.woff2",
							"**/*.ttf",
							"**/*.eot",
						],
						cacheControl: "public,max-age=31536000,immutable",
					},
					// {
					// 	// Disable cache for source maps (optional)
					// 	files: ["**/*.map"],
					// 	cacheControl: "no-store",
					// },
					// {
					// 	// Custom control for images or zip files (optional)
					// 	files: ["**/*.zip"],
					// 	cacheControl: "private,no-cache,no-store,must-revalidate",
					// },
				],
			},
			// uncomment the following block after the VPC is properly setup using endpoints
			// (right now, the API can be accessed from the public internet only)
			// vpc: {
			//   securityGroups: securityGroups,
			//   privateSubnets: privateSubnets,
			// },
			server: {
				runtime: "nodejs22.x",
				layers: [
					"arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:17",
				],
				memory: "1024 MB",
			},
			warm: 2,
			permissions: [
				{
					actions: ["secretsmanager:GetSecretValue"],
					resources: ["*"], // TODO: restrict to the secret ARN
				},
				{
					actions: [
						"bedrock:InvokeModel",
						"bedrock:InvokeModelWithResponseStream",
						"bedrock:CreateModelInvocationJob",
					],
					resources: ["*"],
				},
			],
			transform: {
				cdn(args, opts, name) {
					args.defaultCacheBehavior = {
						...args.defaultCacheBehavior,
						viewerProtocolPolicy: "redirect-to-https",
					};
				},
				// 	server(args, opts, name) {
				// 		args.concurrency = {
				// 			provisioned: 1,
				// 			reserved: 25,
				// 		};
				// 	},
			},
		});
	},
});
