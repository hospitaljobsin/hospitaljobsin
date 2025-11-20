'use client';
import { Spinner } from '@heroui/react';
import dynamic from 'next/dynamic';

const EmployeeBenefitsSettingsClientComponent = dynamic(() => import('./EmployeeBenefitsSettingsClientComponent'), {
	ssr: false,
	loading: () => (
		<div className='w-full h-full flex items-center justify-center'>
			<Spinner size='lg' />
		</div>
	)
});

export default function EmployeeBenefitsSettingsPage() {
	return <EmployeeBenefitsSettingsClientComponent />;
}
