'use client';
import dynamic from 'next/dynamic';
import OrganizationsViewSkeleton from '@/components/organizations/OrganizationsViewSkeleton';

const OrganizationsViewClientComponent = dynamic(() => import('./OrganizationsViewClientComponent'), {
	ssr: false,
	loading: () => <OrganizationsViewSkeleton />
});

export default function OrganizationsPage() {
	return <OrganizationsViewClientComponent />;
}
