import React from 'react';

interface ProgressBarProps {
	label: string;
	percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage }) => {
	return (
		<>
			<div className='flex items-center justify-between'>
				<p className='font-medium'>{label}</p>
				<p className='text-sm font-medium text-background-dark/60 dark:text-background-light/60'>{percentage}%</p>
			</div>
			<div className='h-2 w-full rounded-full bg-primary/20 dark:bg-primary/30'>
				<div className='h-full rounded-full bg-primary' style={{ width: `${percentage}%` }} />
			</div>
		</>
	);
};
