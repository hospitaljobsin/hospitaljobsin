import { env } from "@/lib/env";
import type { APIRequestContext } from "@playwright/test";

type AuthProvider = "password" | "webauthn_credential" | "oauth_google";

type TwoFactorProvider = "authenticator";

type WebAuthnCredential = {
	credentialId: string;
	publicKey: string;
	signCount: number;
	deviceType: string;
	backedUp: boolean;
	nickname: string;
	transports: string[] | null;
	lastUsedAt: string;
};

export type TestAccount = {
	id: string;
	fullName: string;
	password: string | null;
	email: string;
	twoFactorSecret: string | null;
	createdAt: string;
	updatedAt: string | null;
	webauthnCredentials: WebAuthnCredential[];
	recoveryCodes: string[];
	authProviders: AuthProvider[];
	has2faEnabled: boolean;
	twoFactorProviders: TwoFactorProvider[];
};

export type CreateTestAccountData = {
	fullName: string;
	password: string | null;
	email: string;
	twoFactorSecret: string | null;
	enableSudoMode: boolean;
	authProviders: AuthProvider[];
};

export async function createTestAccount(
	context: APIRequestContext,
	{
		fullName,
		password,
		email,
		twoFactorSecret,
		enableSudoMode,
		authProviders,
	}: CreateTestAccountData,
): Promise<TestAccount> {
	const res = await context.post(
		`${env.API_BASE_URL}/test-setup/create-account`,
		{
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				fullName,
				password,
				email,
				twoFactorSecret,
				enableSudoMode,
				authProviders,
			},
		},
	);

	console.log("response status:", res);

	if (!res.ok) {
		throw new Error(`Failed to create test account: ${res.statusText}`);
	}
	return res.json();
}
