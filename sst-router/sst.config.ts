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
		const cachingOptimizedPolicyId = "658327ea-f89d-4fab-a63d-7e88639e58f6";

		const allViewerExceptHostHeaderPolicyId =
			"b689b0a8-53d0-40ab-baf2-68738e2966ac";
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
							pathPattern: "*.js",
							targetOriginId: args.defaultCacheBehavior.targetOriginId,
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: cachingOptimizedPolicyId,
							originRequestPolicyId: allViewerExceptHostHeaderPolicyId,
							minTtl: 0,
							defaultTtl: 31536000,
							maxTtl: 31536000,
						},
						{
							pathPattern: "*.css",
							targetOriginId: args.defaultCacheBehavior.targetOriginId,
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: cachingOptimizedPolicyId,
							originRequestPolicyId: allViewerExceptHostHeaderPolicyId,
							minTtl: 0,
							defaultTtl: 31536000,
							maxTtl: 31536000,
						},
						{
							pathPattern: "*.png",
							targetOriginId: args.defaultCacheBehavior.targetOriginId,
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: cachingOptimizedPolicyId,
							originRequestPolicyId: allViewerExceptHostHeaderPolicyId,
							minTtl: 0,
							defaultTtl: 31536000,
							maxTtl: 31536000,
						},
						{
							pathPattern: "*.jpg",
							targetOriginId: args.defaultCacheBehavior.targetOriginId,
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: cachingOptimizedPolicyId,
							originRequestPolicyId: allViewerExceptHostHeaderPolicyId,
							minTtl: 0,
							defaultTtl: 31536000,
							maxTtl: 31536000,
						},
						{
							pathPattern: "*.woff2",
							targetOriginId: args.defaultCacheBehavior.targetOriginId,
							viewerProtocolPolicy: "redirect-to-https",
							allowedMethods: ["GET", "HEAD"],
							cachedMethods: ["GET", "HEAD"],
							cachePolicyId: cachingOptimizedPolicyId,
							originRequestPolicyId: allViewerExceptHostHeaderPolicyId,
							minTtl: 0,
							defaultTtl: 31536000,
							maxTtl: 31536000,
						},
						// {
						//   pathPattern: "**", // catch-all for dynamic content (SSR, RSC)
						//   targetOriginId: "default",
						//   viewerProtocolPolicy: "redirect-to-https",
						//   allowedMethods: ["GET", "HEAD", "OPTIONS"],
						//   cachedMethods: ["GET", "HEAD"],
						//   cachePolicyId: noCachePolicyId,
						// },
					];

					args.defaultCacheBehavior = {
						...args.defaultCacheBehavior,
						// cachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // managed-caching-optimized
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
