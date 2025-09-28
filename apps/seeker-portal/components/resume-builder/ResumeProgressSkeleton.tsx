import { Progress } from '@heroui/react';

export default function ResumeProgressSkeleton() {
	return (
		<div className='w-full max-w-7xl mx-auto px-4 pb-6 pt-12 lg:px-8 mb-4'>
			<Progress
				label='Resume Progress'
				size='md'
				isDisabled
				className='w-full'
				classNames={{ label: 'text-foreground-600 text-sm', value: 'text-foreground-600' }}
				showValueLabel
				disableAnimation
			/>
		</div>
	);
}
