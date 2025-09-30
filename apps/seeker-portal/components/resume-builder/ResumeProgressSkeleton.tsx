import { Progress, Skeleton } from '@heroui/react';

export default function ResumeProgressSkeleton() {
	return (
		<>
			<Progress
				label='Profile Progress'
				size='md'
				isDisabled
				className='w-full lg:hidden'
				classNames={{ label: 'text-foreground-600 text-sm', value: 'text-foreground-600' }}
				showValueLabel
				disableAnimation
			/>
			<Skeleton className='hidden lg:block h-64 rounded-lg' />
		</>
	);
}
