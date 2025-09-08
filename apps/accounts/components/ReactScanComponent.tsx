'use client';
// biome-ignore assist/source/organizeImports: import react-scan before react
import { scan } from 'react-scan';

import { env } from '@/lib/env/client';
import { type JSX, useEffect } from 'react';

export function ReactScan(): JSX.Element {
	useEffect(() => {
		scan({
			enabled: env.NEXT_PUBLIC_ENVIRONMENT === 'development'
		});
	}, []);

	return <></>;
}
