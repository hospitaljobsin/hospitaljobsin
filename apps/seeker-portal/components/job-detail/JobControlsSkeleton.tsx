'use client';
import { Button, Skeleton } from '@heroui/react';
import { MoreVertical } from 'lucide-react';

export default function JobControlsSkeleton() {
	return (
		<>
			<Skeleton className='hidden sm:block sm:w-64 h-12 rounded-md' />
			<Button size='lg' isIconOnly variant='light' isDisabled className='sm:hidden'>
				<MoreVertical size={24} strokeWidth={1.5} className='text-foreground-500' />
			</Button>
		</>
	);
}
