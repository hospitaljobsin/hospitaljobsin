// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

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
				name: `content.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
				aliases: [process.env.SST_CMS_DOMAIN]
			},
			environment: {
				DATABASE_URI: process.env.DATABASE_URI,
				PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
				NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
				CRON_SECRET: process.env.CRON_SECRET,
				PREVIEW_SECRET: process.env.PREVIEW_SECRET
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
				server(args, opts, name) {
					args.role = process.env.SST_CMS_IAM_ROLE!;
				},
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
