'use client';
import MyJobAlertsViewSkeleton from '@/components/my-alerts/MyJobAlertsViewSkeleton';
import dynamic from 'next/dynamic';

const MyJobAlertsClientComponent = dynamic(() => import('./MyJobAlertsClientComponent'), {
	ssr: false,
	loading: () => <MyJobAlertsViewSkeleton />
});

export default function MyJobAlertsPage() {
	return <MyJobAlertsClientComponent />;
}
