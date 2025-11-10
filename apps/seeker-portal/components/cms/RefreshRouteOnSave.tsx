'use client';

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { env } from '@/lib/env/client';

export const RefreshRouteOnSave = () => {
	const router = useRouter();

	return <PayloadLivePreview refresh={() => router.refresh()} serverURL={env.NEXT_PUBLIC_CMS_URL} />;
};
