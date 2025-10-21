import { Suspense } from 'react';
import OrganizationsViewSkeleton from '@/components/organizations/OrganizationsViewSkeleton';
import OrganizationsViewClientComponent from './OrganizationsViewClientComponent';

export default function OrganizationsPage() {
	return (
		<Suspense fallback={<OrganizationsViewSkeleton />}>
			<OrganizationsViewClientComponent />
		</Suspense>
	);
}
