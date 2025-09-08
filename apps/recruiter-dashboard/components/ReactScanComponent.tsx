/** biome-ignore-all assist/source/organizeImports: React Scan must be imported before react. */
'use client';
import { env } from '@/lib/env/client';
import { type JSX, useEffect } from 'react';
import { scan } from 'react-scan';

export function ReactScan(): JSX.Element {
	useEffect(() => {
		scan({
			enabled: env.NEXT_PUBLIC_ENVIRONMENT === 'development'
		});
	}, []);

	return <></>;
}
