import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config = {
	default: {
		override: {
			tagCache: "dynamodb-lite",
			incrementalCache: "s3-lite",
			queue: "sqs-lite",
			wrapper: "aws-lambda",
		},
	},
	imageOptimization: {
		override: {
			wrapper: "aws-lambda",
		},
		loader: "s3-lite",
	},
} satisfies OpenNextConfig;

export default config;
