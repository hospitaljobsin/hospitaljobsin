'use client';

import { Progress } from '@heroui/react';

interface StepProgressProps {
	currentStep: number; // 1, 2, or 3
	totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
	const progressPercent = (currentStep / totalSteps) * 100;

	return (
		<div className='w-full space-y-2'>
			<div className='flex justify-between items-center'>
				<span className='text-xs text-foreground-500'>
					Step {currentStep} of {totalSteps}
				</span>
				<span className='text-xs text-foreground-500'>{Math.round(progressPercent)}%</span>
			</div>
			<Progress value={progressPercent} minValue={0} maxValue={100} aria-label='Form progress' className='w-full' color='primary' />
		</div>
	);
}
