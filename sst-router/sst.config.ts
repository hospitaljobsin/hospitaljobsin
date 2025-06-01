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
		new sst.aws.Router("SharedRouter", {
			domain: {
				name: "hospitaljobs.in",
				aliases: ["*.hospitaljobs.in"],
			},
			transform: {
				cdn(args, opts, name) {
					args.defaultCacheBehavior = {
						...args.defaultCacheBehavior,
						viewerProtocolPolicy: "redirect-to-https",
					};
				},
			},
		});
	},
});
