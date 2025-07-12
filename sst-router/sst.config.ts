/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "sst-router",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: false,
			home: "aws",
		};
	},
	async run() {
		const cachingOptimizedPolicyId = "658327ea-f89d-4fab-a63d-7e88639e58f6";

		new sst.aws.Router("SharedRouter", {
			domain: {
				name: "hospitaljobs.in",
				aliases: ["*.hospitaljobs.in"],
				redirects: ["www.hospitaljobs.in"],
			},
			transform: {
				cdn(args, opts, name) {
					args.defaultCacheBehavior = {
						...args.defaultCacheBehavior,
						// cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // managed-caching-optimized
						viewerProtocolPolicy: "redirect-to-https",
					};
					// args.origins = [
					// 	{
					// 		originId: "default",
					// 		domainName: "hospitaljobs.in",
					// 		customOriginConfig: {
					// 			originProtocolPolicy: "https-only",
					// 			httpPort: 80,
					// 			httpsPort: 443,
					// 			originSslProtocols: ["TLSv1.2"],
					// 			originReadTimeout: 30,
					// 		},
					// 	},
					// ];
					// args.orderedCacheBehaviors = [
					// 	// Next.js versioned assets
					// 	{
					// 		pathPattern: "/_next/static/*",
					// 		targetOriginId: args.defaultCacheBehavior.targetOriginId,
					// 		viewerProtocolPolicy: "https-only",
					// 		allowedMethods: ["GET", "HEAD"],
					// 		cachedMethods: ["GET", "HEAD"],
					// 		cachePolicyId: cachingOptimizedPolicyId,
					// 		originRequestPolicyId: "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf", // Managed-CORS-S3Origin
					// 		minTtl: 0,
					// 		defaultTtl: 31536000,
					// 		maxTtl: 31536000,
					// 	},
					// 	// Public assets outside _next
					// 	{
					// 		pathPattern: "/assets/*",
					// 		targetOriginId: args.defaultCacheBehavior.targetOriginId,
					// 		viewerProtocolPolicy: "https-only",
					// 		allowedMethods: ["GET", "HEAD"],
					// 		cachedMethods: ["GET", "HEAD"],
					// 		cachePolicyId: cachingOptimizedPolicyId,
					// 		originRequestPolicyId: "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf", // Managed-CORS-S3Origin
					// 		minTtl: 0,
					// 		defaultTtl: 31536000,
					// 		maxTtl: 31536000,
					// 	},
					// ];
				},
				cachePolicy(args, opts, name) {
					// TODO: this is ALL actually in the opennext SST Nextjs abstraction
					// https://github.com/opennextjs/opennextjs-aws/blob/main/examples/sst/stacks/OpenNextReferenceImplementation.ts
					// we broke caching only because we started using a custom router
					args.name = "NextJsAppRouterPolicy";
					args.comment =
						"Custom cache policy for Next.js App Router + next/image";
					args.minTtl = 0;
					args.defaultTtl = 0;
					args.maxTtl = 31536000; // Must be > 0 to not disable caching completely
					args.parametersInCacheKeyAndForwardedToOrigin = {
						enableAcceptEncodingGzip: true,
						enableAcceptEncodingBrotli: true,
						headersConfig: {
							headerBehavior: "whitelist",
							headers: {
								items: [
									"accept",
									"rsc",
									"next-router-prefetch",
									"next-router-state-tree",
									"next-url",
									"x-prerender-revalidate",
								],
							},
						},
						cookiesConfig: {
							cookieBehavior: "all",
						},
						queryStringsConfig: {
							queryStringBehavior: "whitelist",
							queryStrings: {
								items: ["q", "w", "url"],
							},
						},
					};
				},
			},
		});
	},
});
