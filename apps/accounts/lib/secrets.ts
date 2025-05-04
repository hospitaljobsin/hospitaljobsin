export async function loadSecrets() {
	if (process.env.AWS_SECRET_ID !== undefined) {
		console.info("Loading secrets from AWS Secrets Manager");
		const secretId = process.env.AWS_SECRET_ID;
		const port = process.env.PARAMETERS_SECRETS_EXTENSION_HTTP_PORT || 2773;
		// use local Secrets & Parameters Lambda Extension
		const res = await fetch(
			`http://localhost:${port}/secretsmanager/get?secretId=${secretId}`,
			{
				headers: {
					"X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN ?? "",
				},
			},
		);
		if (!res.ok) {
			throw new Error(
				`Failed to load secret from extension: ${res.status} ${res.statusText}`,
			);
		}
		const payload = await res.json();
		if (!payload.SecretString) {
			throw new Error("SecretString missing in extension response");
		}
		const secret = JSON.parse(payload.SecretString);
		if (secret.jwe_secret_key) {
			process.env.JWE_SECRET_KEY = secret.jwe_secret_key;
		}
	}
}
