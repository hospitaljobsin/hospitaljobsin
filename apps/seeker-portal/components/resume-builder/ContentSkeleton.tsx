'use client';

export default function ContentSkeleton() {
	return (
		<div className='w-full flex flex-col gap-6 animate-pulse'>
			<div className='h-8 bg-gray-200 rounded-md w-1/3' />
			<div className='space-y-4'>
				<div className='h-4 bg-gray-200 rounded w-full' />
				<div className='h-4 bg-gray-200 rounded w-3/4' />
				<div className='h-4 bg-gray-200 rounded w-1/2' />
			</div>
			<div className='space-y-3'>
				<div className='h-10 bg-gray-200 rounded-md' />
				<div className='h-10 bg-gray-200 rounded-md' />
				<div className='h-10 bg-gray-200 rounded-md' />
			</div>
		</div>
	);
}
