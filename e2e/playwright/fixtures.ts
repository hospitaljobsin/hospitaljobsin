import { createTestAccount, TestAccount } from '@/tests/utils/authentication';
import { TOTP_USER_SECRET } from '@/tests/utils/constants';
import { test as baseTest } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';

type WorkerFixtures = {
  testAccounts: {
    passwordAccount: TestAccount;
    webauthnAccount: TestAccount;
    twoFactorAccount: TestAccount;
    storageStates: {
      password: string;
      webauthn: string;
      twoFactor: string;
    };
  };
};

export const test = baseTest.extend<{}, WorkerFixtures>({
  testAccounts: [async ({ browser }, use) => {
    const id = test.info().parallelIndex;
    const baseDir = path.resolve(test.info().project.outputDir, `.auth`);
    fs.mkdirSync(baseDir, { recursive: true });

    const storageStates = {
      password: path.join(baseDir, `password-${id}.json`),
      webauthn: path.join(baseDir, `webauthn-${id}.json`),
      twoFactor: path.join(baseDir, `2fa-${id}.json`)
    };

    const accountFiles = {
      password: path.join(baseDir, `password-${id}.user.json`),
      webauthn: path.join(baseDir, `webauthn-${id}.user.json`),
      twoFactor: path.join(baseDir, `2fa-${id}.user.json`)
    };

    const createUserContext = async (
      options: Parameters<typeof createTestAccount>[0],
      storagePath: string,
      accountPath: string
    ): Promise<TestAccount> => {
      if (fs.existsSync(storagePath) && fs.existsSync(accountPath)) {
        return JSON.parse(fs.readFileSync(accountPath, 'utf-8')) as TestAccount;
      }

      const page = await browser.newPage({ storageState: undefined });
      const user = await createTestAccount(options);
      await page.context().storageState({ path: storagePath });
      await page.close();

      fs.writeFileSync(accountPath, JSON.stringify(user, null, 2));
      return user;
    };

    const passwordAccount = await createUserContext({
      email: `tester-${id}@gmail.com`,
      password: 'Password123!',
      fullName: `Tester ${id}`,
      twoFactorSecret: null,
      enableSudoMode: true,
      authProviders: ['password'],
    }, storageStates.password, accountFiles.password);

    const webauthnAccount = await createUserContext({
      email: `tester-webauthn-${id}@gmail.com`,
      password: null,
      fullName: `Tester ${id}`,
      twoFactorSecret: null,
      enableSudoMode: true,
      authProviders: ['webauthn_credential'],
    }, storageStates.webauthn, accountFiles.webauthn);

    const twoFactorAccount = await createUserContext({
      email: `two-factor-${id}@gmail.com`,
      password: 'Password123!',
      fullName: `Tester ${id}`,
      twoFactorSecret: TOTP_USER_SECRET,
      enableSudoMode: true,
      authProviders: ['password'],
    }, storageStates.twoFactor, accountFiles.twoFactor);

    await use({
      passwordAccount,
      webauthnAccount,
      twoFactorAccount,
      storageStates,
    });
  }, { scope: 'worker' }],
});
