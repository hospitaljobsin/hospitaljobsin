'use client';
import MyJobAlertsViewSkeleton from '@/components/my-alerts/MyJobAlertsViewSkeleton';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const MyJobAlertsClientComponent = dynamic(() => import('./MyJobAlertsClientComponent'), {
	ssr: false,
	loading: () => <MyJobAlertsViewSkeleton />
});

export const metadat: Metadata = {};

export default function MyJobAlertsPage() {
	return <MyJobAlertsClientComponent />;
}
