import type { OpenNextConfig } from '@opennextjs/aws/types/open-next.js';

const config = {
	default: {
		override: {
			tagCache: 'dynamodb-lite',
			incrementalCache: 's3-lite',
			queue: 'sqs-lite',
			wrapper: 'aws-lambda'
		},
		// Install native dependencies with correct architecture for Lambda
		install: {
			packages: ['sharp@0.34.2', 'unrs-resolver'],
			arch: 'arm64',
			nodeVersion: '20',
			libc: 'glibc'
		}
	},
	imageOptimization: {
		override: {
			wrapper: 'aws-lambda'
		},
		loader: 's3-lite',
		// Install sharp with correct architecture for Lambda image optimization function
		install: {
			packages: ['sharp@0.34.2'],
			arch: 'arm64',
			nodeVersion: '20',
			libc: 'glibc'
		}
	}
} satisfies OpenNextConfig;

export default config;
