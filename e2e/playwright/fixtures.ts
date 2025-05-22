import { createTestAccount } from '@/tests/utils/authentication';
import { TOTP_USER_SECRET } from '@/tests/utils/constants';
import { test as baseTest } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [async ({ browser }, use) => {
    // Use parallelIndex as a unique identifier for each worker.
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      // Reuse existing authentication state if any.
    //   await use(fileName);
      return;
    }

    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Acquire a unique account, for example create a new one.
    // Alternatively, you can have a list of precreated accounts for testing.
    // Make sure that accounts are unique, so that multiple team members
    // can run tests at the same time without interference.
    // const account = await acquireAccount(id);
    const account = await createTestAccount({
        email: `tester-${id}@gmail.com`,
        password: "Password123!",
        fullName: `Tester ${id}`,
        twoFactorSecret: null,
        enableSudoMode: true,
        authProviders: ["password"],
    })
    
    const webauthnAccount = await createTestAccount({
        email: `tester-webauthn-${id}@gmail.com`,
        password: null,
        fullName: `Tester ${id}`,
        twoFactorSecret: null,
        enableSudoMode: true,
        authProviders: ["webauthn_credential"],
    })

    const twoFactorAccount = await createTestAccount({
        email: `two-factor-${id}@gmail.com`,
        password: "Password123!",
        fullName: `Tester ${id}`,
        twoFactorSecret: TOTP_USER_SECRET,
        enableSudoMode: true,
        authProviders: ["password"],
    })

    // End of authentication steps.

    // TODO: can we store the test user accounts somewhere here?

    await page.context().storageState({ path: fileName });
    await page.close();
    // await use(fileName);
  }, { scope: 'worker' }],
});