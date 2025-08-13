import { env } from "@/lib/env";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { execSync } from "node:child_process";

async function globalTeardown() {
	console.log("🧹 Tearing down test data...");

	if (env.ENVIRONMENT === "staging") {
		console.log(
			"🚀 Staging environment detected, invoking Lambda function to teardown test database...",
		);

		// Check if Lambda function configuration is available
		if (!env.STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN) {
			throw new Error(
				"STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN environment variable must be set for staging environment",
			);
		}

		try {
			// Initialize AWS Lambda client
			const lambdaClient = new LambdaClient({
				region: env.AWS_REGION,
			});

			// Determine function identifier (prefer ARN over name)
			const functionIdentifier = env.STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN;
			if (!functionIdentifier) {
				console.warn(
					"⚠️ No Lambda function identifier available, skipping teardown",
				);
				return;
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
				console.warn(
					`⚠️ Lambda teardown invocation returned status code: ${response.StatusCode}`,
				);
			} else {
				console.log(
					"✅ Test database teardown completed successfully via Lambda",
				);
			}

			// Parse the response payload if available
			if (response.Payload) {
				try {
					const responseData = JSON.parse(
						Buffer.from(response.Payload).toString(),
					);
					console.log("📊 Lambda teardown response:", responseData);
				} catch (parseError) {
					console.log(
						"📊 Lambda teardown response (raw):",
						response.Payload.toString(),
					);
				}
			}
		} catch (error) {
			console.error(
				"❌ Failed to invoke Lambda function for test database teardown:",
				error,
			);
			// Don't throw error during teardown, just log it
		}
	} else {
		console.log(
			"🐳 Local environment detected, using Docker Compose for test database teardown...",
		);
		execSync("docker compose exec test-server python scripts/teardown_e2e.py", {
			stdio: "inherit",
		});
	}
}

export default globalTeardown;
