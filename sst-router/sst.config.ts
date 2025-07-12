/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "sst-router",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		const noCachePolicyId = "c77fd332-13ef-467a-83a6-75fef01eb223";
		new sst.aws.Router("SharedRouter", {
			domain: {
				name: "hospitaljobs.in",
				aliases: ["*.hospitaljobs.in"],
				redirects: ["www.hospitaljobs.in"],
			},
			transform: {
				cdn(args, opts, name) {
					args.orderedCacheBehaviors = [
						{
							pathPattern: "*.png",
							targetOriginId: "s3-origin",
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // managed-caching-optimized
						},
						{
							pathPattern: "**",
							targetOriginId: "s3-origin",
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD", "OPTIONS"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: noCachePolicyId, // Replace with the ID from your transform.cachePolicy config
						},
					];
					args.defaultCacheBehavior = {
						...args.defaultCacheBehavior,
						cachePolicyId: noCachePolicyId, // managed-caching-optimized
						viewerProtocolPolicy: "redirect-to-https",
					};
				},
				cachePolicy(args, opts, name) {
					args.name = "NextJsAppRouterPolicy";
					args.comment =
						"Custom cache policy for Next.js App Router + next/image";
					args.minTtl = 0;
					args.defaultTtl = 0;
					args.maxTtl = 1; // Must be > 0 to not disable caching completely
					args.parametersInCacheKeyAndForwardedToOrigin = {
						enableAcceptEncodingGzip: true,
						enableAcceptEncodingBrotli: true,
						headersConfig: {
							headerBehavior: "whitelist",
							headers: {
								items: [
									"RSC",
									"Next-Router-Prefetch",
									"Next-Router-State-Tree",
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
