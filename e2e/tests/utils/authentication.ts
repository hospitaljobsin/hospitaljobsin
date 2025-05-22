type AuthProvider = "password" | "webauthn_credential" | "oauth_google"

type TwoFactorProvider = "authenticator"

type WebAuthnCredential = {
    credentialId: string;
    publicKey: string;
    signCount: number;
    deviceType: string;
    backedUp: boolean;
    nickname: string;
    transports: string[] | null;
    lastUsedAt: string;
}

type TestAccount = {
    id: string;
    isActive: boolean;
    username: string;
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
}

export async function createTestAccount({username, fullName, password, email, twoFactorSecret, enableSudoMode, authProviders}: {
    username: string;
    fullName: string;
    password: string | null;
    email: string;
    twoFactorSecret: string | null;
    enableSudoMode: boolean;
    authProviders: AuthProvider[];
}): Promise<TestAccount> {
    const res = await fetch('http://localhost:8000/test-setup/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            fullName,
            password,
            email,
            twoFactorSecret,
            enableSudoMode,
            authProviders,
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to create test account: ${res.statusText}`);
    }
    return res.json();
}