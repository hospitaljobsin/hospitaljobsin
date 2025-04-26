import defaultWrapper from "@opennextjs/aws/overrides/wrappers/aws-lambda.js";

export async function loadSecrets() {
	if (process.env.AWS_SECRET_ID !== undefined) {
		console.log("Loading secrets from AWS Secrets Manager");
		const secretId = process.env.AWS_SECRET_ID;
		const runtimeApi = process.env.AWS_LAMBDA_RUNTIME_API;
		if (runtimeApi) {
			console.log("Using AWS Lambda Runtime API to load secrets");
			// use local Secrets & Parameters Extension
			const url = `http://localhost:2773/secretsmanager/get?secretId=${secretId}`;
			const res = await fetch(url, {
				headers: {
					"X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN ?? "",
				},
			});
			if (!res.ok) {
				throw new Error(
					`Failed to load secret from extension: ${res.status} ${res.statusText}`,
				);
			}
			const payload = await res.json();
			console.log("Loaded secret from extension", payload);
			if (!payload.SecretString) {
				throw new Error("SecretString missing in extension response");
			}
			const secret = JSON.parse(payload.secretString);
			if (secret.jwe_secret_key) {
				console.log("Loaded JWE secret key from AWS Secrets Manager");
				process.env.JWE_SECRET_KEY = secret.jwe_secret_key;
			}
		}
	}
}

loadSecrets().catch((err) => {
	console.error("Failed to load secrets", err);
	process.exit(1);
});

export default defaultWrapper;
