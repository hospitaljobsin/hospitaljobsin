import {
	type TestAccount,
	createTestAccount,
} from "@/tests/utils/authentication";
import { TOTP_USER_SECRET } from "@/tests/utils/constants";
import {
	type BrowserContext,
	test as baseTest,
	request,
} from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
export { expect } from "@playwright/test";

// TODO: in the future, reuse the same test accounts for sudo mode enabled/disabled
// there is no need to create separate accounts for sudo mode tests

const createUserContext = async (
	options: Parameters<typeof createTestAccount>[1],
	storagePath: string,
	accountPath: string,
): Promise<TestAccount> => {
	console.log(`Creating user context for ${options.email}...`);
	if (fs.existsSync(storagePath) && fs.existsSync(accountPath)) {
		return JSON.parse(fs.readFileSync(accountPath, "utf-8")) as TestAccount;
	}
	// Important: make sure we authenticate in a clean environment by unsetting storage state.
	const context = await request.newContext({ storageState: undefined });
	const user = await createTestAccount(context, options);
	await context.storageState({ path: storagePath });
	await context.dispose();

	fs.writeFileSync(accountPath, JSON.stringify(user, null, 2));
	return user;
};

type WorkerFixtures = {
	passwordAuth: {
		account: TestAccount;
		storageState: string;
	};
	webauthnAuth: {
		account: TestAccount;
		storageState: string;
	};
	twoFactorAuth: {
		account: TestAccount;
		storageState: string;
	};
	passwordAuthSudoMode: {
		account: TestAccount;
		storageState: string;
	};
	webauthnAuthSudoMode: {
		account: TestAccount;
		storageState: string;
	};
	twoFactorAuthSudoMode: {
		account: TestAccount;
		storageState: string;
	};
};

export const test = baseTest.extend<{}, WorkerFixtures>({
	passwordAuth: [
		async ({ browser }, use) => {
			const id = test.info().workerIndex;
			const baseDir = path.resolve(test.info().project.outputDir, ".auth");
			fs.mkdirSync(baseDir, { recursive: true });

			const storageState = path.join(baseDir, `password-${id}.json`);

			const accountFile = path.join(baseDir, `password-${id}.user.json`);

			const account = await createUserContext(
				{
					email: `tester-${id}@gmail.com`,
					password: "Password123!",
					fullName: `Tester ${id}`,
					twoFactorSecret: null,
					enableSudoMode: false,
					authProviders: ["password"],
				},
				storageState,
				accountFile,
			);

			await use({
				account,
				storageState,
			});
		},
		{ scope: "worker" },
	],
	webauthnAuth: [
		async ({ browser }, use) => {
			const id = test.info().workerIndex;
			const baseDir = path.resolve(test.info().project.outputDir, ".auth");
			fs.mkdirSync(baseDir, { recursive: true });

			const storageState = path.join(baseDir, `webauthn-${id}.json`);

			const accountFile = path.join(baseDir, `webauthn-${id}.user.json`);

			const account = await createUserContext(
				{
					email: `tester-webauthn-${id}@gmail.com`,
					password: null,
					fullName: `Tester ${id}`,
					twoFactorSecret: null,
					enableSudoMode: false,
					authProviders: ["webauthn_credential"],
				},
				storageState,
				accountFile,
			);

			await use({
				account,
				storageState,
			});
		},
		{ scope: "worker" },
	],
	twoFactorAuth: [
		async ({ browser }, use) => {
			const id = test.info().workerIndex;
			const baseDir = path.resolve(test.info().project.outputDir, ".auth");
			fs.mkdirSync(baseDir, { recursive: true });

			const storageState = path.join(baseDir, `2fa-${id}.json`);

			const accountFile = path.join(baseDir, `2fa-${id}.user.json`);

			const account = await createUserContext(
				{
					email: `two-factor-${id}@gmail.com`,
					password: "Password123!",
					fullName: `Tester ${id}`,
					twoFactorSecret: TOTP_USER_SECRET,
					enableSudoMode: false,
					authProviders: ["password"],
				},
				storageState,
				accountFile,
			);

			await use({
				account,
				storageState,
			});
		},
		{ scope: "worker" },
	],
	passwordAuthSudoMode: [
		async ({ browser }, use) => {
			const id = test.info().workerIndex;
			const baseDir = path.resolve(test.info().project.outputDir, ".auth");
			fs.mkdirSync(baseDir, { recursive: true });

			const storageState = path.join(baseDir, `password-sudo-${id}.json`);

			const accountFile = path.join(baseDir, `password-sudo-${id}.user.json`);

			const account = await createUserContext(
				{
					email: `tester-sudo-${id}@gmail.com`,
					password: "Password123!",
					fullName: `Tester ${id}`,
					twoFactorSecret: null,
					enableSudoMode: true,
					authProviders: ["password"],
				},
				storageState,
				accountFile,
			);

			await use({
				account,
				storageState,
			});
		},
		{ scope: "worker" },
	],
	webauthnAuthSudoMode: [
		async ({ browser }, use) => {
			const id = test.info().workerIndex;
			const baseDir = path.resolve(test.info().project.outputDir, ".auth");
			fs.mkdirSync(baseDir, { recursive: true });

			const storageState = path.join(baseDir, `webauthn-sudo-${id}.json`);

			const accountFile = path.join(baseDir, `webauthn-sudo-${id}.user.json`);

			const account = await createUserContext(
				{
					email: `tester-webauthn-sudo-${id}@gmail.com`,
					password: null,
					fullName: `Tester ${id}`,
					twoFactorSecret: null,
					enableSudoMode: true,
					authProviders: ["webauthn_credential"],
				},
				storageState,
				accountFile,
			);

			await use({
				account,
				storageState,
			});
		},
		{ scope: "worker" },
	],
	twoFactorAuthSudoMode: [
		async ({ browser }, use) => {
			const id = test.info().workerIndex;
			const baseDir = path.resolve(test.info().project.outputDir, ".auth");
			fs.mkdirSync(baseDir, { recursive: true });

			const storageState = path.join(baseDir, `2fa-sudo-${id}.json`);

			const accountFile = path.join(baseDir, `2fa-sudo-${id}.user.json`);

			const account = await createUserContext(
				{
					email: `two-factor-sudo-${id}@gmail.com`,
					password: "Password123!",
					fullName: `Tester ${id}`,
					twoFactorSecret: TOTP_USER_SECRET,
					enableSudoMode: true,
					authProviders: ["password"],
				},
				storageState,
				accountFile,
			);

			await use({
				account,
				storageState,
			});
		},
		{ scope: "worker" },
	],
});

export const authTest = test.extend<{}, { context: BrowserContext }>({
	context: async ({ browser, passwordAuth }, use) => {
		const context = await browser.newContext({
			storageState: passwordAuth.storageState,
		});
		await use(context);
		await context.close();
	},
});

export const authSudoModeTest = test.extend<{}, { context: BrowserContext }>({
	context: async ({ browser, passwordAuthSudoMode }, use) => {
		const context = await browser.newContext({
			storageState: passwordAuthSudoMode.storageState,
		});
		await use(context);
		await context.close();
	},
});

export const webauthnTest = test.extend<{}, { context: BrowserContext }>({
	context: async ({ browser, webauthnAuth }, use) => {
		const context = await browser.newContext({
			storageState: webauthnAuth.storageState,
		});
		await use(context);
		await context.close();
	},
});

export const webauthnSudoModeTest = test.extend<
	{},
	{ context: BrowserContext }
>({
	context: async ({ browser, webauthnAuthSudoMode }, use) => {
		const context = await browser.newContext({
			storageState: webauthnAuthSudoMode.storageState,
		});
		await use(context);
		await context.close();
	},
});

export const twoFactorTest = test.extend<{}, { context: BrowserContext }>({
	context: async ({ browser, twoFactorAuth }, use) => {
		const context = await browser.newContext({
			storageState: twoFactorAuth.storageState,
		});
		await use(context);
		await context.close();
	},
});
