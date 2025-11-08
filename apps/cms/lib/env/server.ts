import { createEnv } from '@t3-oss/env-nextjs';
import 'server-only';

export const serverEnv = createEnv({
	server: {},
	runtimeEnv: {},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
