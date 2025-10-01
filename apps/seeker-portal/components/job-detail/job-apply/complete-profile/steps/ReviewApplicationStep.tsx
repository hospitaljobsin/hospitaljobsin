'use client';

import { Button } from '@heroui/react';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import links from '@/lib/links';
import CompleteProfileContext from '../CompleteProfileContext';

interface ReviewApplicationStepProps {
	isLoading: boolean;
}

export default function ReviewApplicationStep({ isLoading }: ReviewApplicationStepProps) {
	const { send } = CompleteProfileContext.useActorRef();

	const handleApply = () => {
		send({ type: 'APPLY_FOR_JOB' });
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	return (
		<div className='space-y-6'>
			<div className='space-y-4'>
				<h3 className='text-lg font-medium'>Ready to Apply</h3>
				<p className='text-sm text-foreground-600'>Review your application before submitting.</p>
				<p className='text-sm text-foreground-700 w-full'>
					Improve your chances by{' '}
					<Link
						href={links.resumeBuilder}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-2 min-w-min text-primary'
					>
						updating your resume. <ExternalLinkIcon size={14} />
					</Link>
				</p>
			</div>

			<div className='flex gap-3'>
				<Button type='button' variant='flat' fullWidth onPress={handlePrevious} isDisabled={isLoading}>
					Previous
				</Button>
				<Button color='primary' fullWidth onPress={handleApply} isLoading={isLoading} isDisabled={isLoading}>
					Apply for Job
				</Button>
			</div>
		</div>
	);
}
