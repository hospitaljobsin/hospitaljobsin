import { env } from "@/lib/env";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import type { FullConfig } from "@playwright/test";
import { execSync } from "node:child_process";

async function globalSetup(config: FullConfig) {
	console.log("🌱 Seeding test data...");

	if (env.ENVIRONMENT === "staging") {
		console.log(
			"🚀 Staging environment detected, invoking Lambda function to setup test database...",
		);

		// Check if Lambda function configuration is available
		if (!env.STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN) {
			throw new Error(
				"STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN environment variable must be set for staging environment",
			);
		}

		try {
			// Initialize AWS Lambda client
			const lambdaClient = new LambdaClient({
				region: env.AWS_REGION,
			});

			// Determine function identifier (prefer ARN over name)
			const functionIdentifier = env.STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN;
			if (!functionIdentifier) {
				throw new Error("No Lambda function identifier available");
			}

			console.log(
				`📞 Invoking Lambda function: ${functionIdentifier} in region: ${env.AWS_REGION}`,
			);

			// Prepare the payload
			const payload = JSON.stringify({});

			// Create the invoke command
			const command = new InvokeCommand({
				FunctionName: functionIdentifier,
				Payload: Buffer.from(payload),
				InvocationType: "RequestResponse", // Synchronous invocation
			});

			// Invoke the Lambda function
			const response = await lambdaClient.send(command);

			// Check the response
			if (response.StatusCode !== 200) {
				throw new Error(
					`Lambda invocation failed with status code: ${response.StatusCode}`,
				);
			}

			// Parse the response payload if available
			if (response.Payload) {
				try {
					const responseData = JSON.parse(
						Buffer.from(response.Payload).toString(),
					);
					console.log("📊 Lambda response:", responseData);
				} catch (parseError) {
					console.log("📊 Lambda response (raw):", response.Payload.toString());
				}
			}

			console.log("✅ Test database setup completed successfully via Lambda");
		} catch (error) {
			console.error(
				"❌ Failed to invoke Lambda function for test database setup:",
				error,
			);
			throw new Error(
				`Lambda invocation failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	} else {
		console.log(
			"🐳 Local environment detected, using Docker Compose for test database setup...",
		);
		execSync("docker compose exec test-server python scripts/setup_e2e.py", {
			stdio: "inherit",
		});
	}
}

export default globalSetup;
