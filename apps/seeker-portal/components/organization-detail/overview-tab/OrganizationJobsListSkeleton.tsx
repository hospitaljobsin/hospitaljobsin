import { Briefcase } from 'lucide-react';
import JobListSkeleton from '../../landing/JobListSkeleton';

export default function OrganizationJobsListSkeleton() {
	return (
		<div className='w-full flex flex-col gap-6'>
			<div className='w-full flex items-center gap-4 px-2 text-foreground-600'>
				<Briefcase className='w-5 h-5' />
				<p>Posted Jobs</p>
			</div>
			<JobListSkeleton />
		</div>
	);
}
