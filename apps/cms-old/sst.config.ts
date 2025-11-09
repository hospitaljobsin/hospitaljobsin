// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />
const { env } = await import('./lib/env/client');

export default $config({
	app(input) {
		return {
			name: 'cms',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'aws'
		};
	},

	async run() {
		const enableBasicAuth = $app.stage === 'staging';

		// Encode the Basic Auth credentials from process.env
		let basicAuthHeader: string | undefined;
		if (enableBasicAuth) {
			const username = process.env.BASIC_AUTH_USERNAME || '';
			const password = process.env.BASIC_AUTH_PASSWORD || '';
			basicAuthHeader = Buffer.from(`${username}:${password}`).toString('base64');
		}

		new sst.aws.Nextjs('cms-ui', {
			buildCommand: 'pnpm run package',
			domain: {
				name: `content.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
				aliases: [process.env.SST_CMS_DOMAIN]
			},
			environment: {
				NEXT_PUBLIC_URL: env.NEXT_PUBLIC_URL,
				NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
				NEXT_PUBLIC_SENTRY_ORGANIZATION: env.NEXT_PUBLIC_SENTRY_ORGANIZATION,
				NEXT_PUBLIC_SENTRY_PROJECT: env.NEXT_PUBLIC_SENTRY_PROJECT,
				NEXT_PUBLIC_ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT,
				NEXT_PUBLIC_ROOT_DOMAIN: env.NEXT_PUBLIC_ROOT_DOMAIN,
				OST_GITHUB_SECRET: process.env.OST_GITHUB_SECRET,
				OST_GITHUB_ID: process.env.OST_GITHUB_ID,
				OST_REPO_SLUG: process.env.OST_REPO_SLUG,
				OST_REPO_BRANCH: process.env.OST_REPO_BRANCH,
				OST_REPO_OWNER: process.env.OST_REPO_OWNER
			},
			assets: {
				textEncoding: 'utf-8',
				versionedFilesCacheHeader: 'public,max-age=31536000,immutable',
				nonVersionedFilesCacheHeader: 'public,max-age=0,s-maxage=86400,stale-while-revalidate=8640',
				fileOptions: [
					{
						files: ['**/*.js', '**/*.css', '**/*.woff2', '**/*.ttf', '**/*.eot'],
						cacheControl: 'public,max-age=31536000,immutable'
					},
					{
						files: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.svg'],
						cacheControl: 'public,max-age=31536000,immutable'
					}
				]
			},
			server: {
				runtime: 'nodejs22.x',
				layers: ['arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:17'],
				memory: '1024 MB'
			},
			warm: 5,
			permissions: [
				{
					actions: ['secretsmanager:GetSecretValue'],
					resources: ['*'] // TODO: restrict to the secret ARN
				}
			],
			transform: {
				cdn(args, opts, name) {
					args.defaultCacheBehavior = {
						...args.defaultCacheBehavior,
						viewerProtocolPolicy: 'redirect-to-https'
					};
					args.transform = {
						distribution(args, opts, name) {
							args.priceClass = 'PriceClass_100';
							args.httpVersion = 'http3';
							args.isIpv6Enabled = true;
							// args.staging = false; TODO: maybe utilize cloudfront staging distributions in future for quick deployments
							// args.continuousDeploymentPolicyId = "" While doing that, set this on the production distribution
						}
					};
				}
			},
			...(enableBasicAuth && {
				edge: {
					viewerRequest: {
						injection: `
							if (
								!event.request.headers.authorization ||
								event.request.headers.authorization.value !== "Basic ${basicAuthHeader}"
							) {
								return {
									statusCode: 401,
									statusDescription: "Unauthorized",
									headers: {
										"www-authenticate": { value: "Basic" }
									}
								};
							}
						`
					}
				}
			})
		});
	}
});
