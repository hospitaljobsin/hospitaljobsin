import fs from "node:fs";
import path from "node:path";
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
export { expect } from "@playwright/test";

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
};

export const test = baseTest.extend<{}, WorkerFixtures>({
	passwordAuth: [
		async ({ browser }, use) => {
			const id = test.info().parallelIndex;
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
	webauthnAuth: [
		async ({ browser }, use) => {
			const id = test.info().parallelIndex;
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
	twoFactorAuth: [
		async ({ browser }, use) => {
			const id = test.info().parallelIndex;
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
