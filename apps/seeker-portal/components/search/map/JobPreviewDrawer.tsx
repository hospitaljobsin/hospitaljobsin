'use client';

import { Avatar, Button, Chip, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/react';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Clock, DollarSign, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { graphql, useFragment } from 'react-relay';
import type { JobPreviewDrawerFragment_job$key } from '@/__generated__/JobPreviewDrawerFragment_job.graphql';
import type { MapViewClientComponentFragment$data } from '@/__generated__/MapViewClientComponentFragment.graphql';
import links from '@/lib/links';

interface JobPreviewDrawerProps {
	jobId: string;
	data: MapViewClientComponentFragment$data;
	isOpen?: boolean;
	onClose: () => void;
}

export default function JobPreviewDrawer({ jobId, data, isOpen = true, onClose }: JobPreviewDrawerProps) {
	// Find the job in the data
	const job = data.jobs?.edges?.find(edge => edge.node.id === jobId)?.node;

	if (!job) {
		return null;
	}

	return (
		<>
			{/* Mobile/Tablet Drawer */}
			{isOpen !== undefined && (
				<Drawer
					isOpen={isOpen}
					onOpenChange={open => !open && onClose()}
					placement='bottom'
					size='full'
					classNames={{
						base: 'max-h-[85vh] md:max-h-[70vh]' // Larger drawer on tablet
					}}
					aria-label='Job preview drawer'
				>
					<DrawerContent>
						{onDrawerClose => (
							<>
								<DrawerHeader className='flex justify-between items-center border-b border-divider'>
									<span className='text-lg font-semibold'>Job Details</span>
									<Button isIconOnly variant='light' onPress={onDrawerClose} aria-label='Close'>
										<X className='w-5 h-5' />
									</Button>
								</DrawerHeader>
								<DrawerBody className='py-4'>
									<JobPreviewContent jobKey={job} />
								</DrawerBody>
								<DrawerFooter className='border-t border-divider'>
									<Button
										as={Link}
										href={links.jobDetail(job.organization?.slug || '', job.slug || '')}
										color='primary'
										fullWidth
										size='lg'
									>
										View Full Details
									</Button>
								</DrawerFooter>
							</>
						)}
					</DrawerContent>
				</Drawer>
			)}

			{/* Desktop Card (no drawer wrapper) */}
			{isOpen === undefined && (
				<div className='p-4'>
					<div className='flex justify-between items-center mb-4'>
						<span className='text-lg font-semibold'>Job Details</span>
						<Button isIconOnly variant='light' onPress={onClose} aria-label='Close' size='sm'>
							<X className='w-4 h-4' />
						</Button>
					</div>
					<JobPreviewContent jobKey={job} />
					<Button
						as={Link}
						href={links.jobDetail(job.organization?.slug || '', job.slug || '')}
						color='primary'
						fullWidth
						size='lg'
						className='mt-4'
					>
						View Full Details
					</Button>
				</div>
			)}
		</>
	);
}

// Separate component for the actual content
function JobPreviewContent({ jobKey }: { jobKey: JobPreviewDrawerFragment_job$key }) {
	const job = useFragment(
		graphql`
			fragment JobPreviewDrawerFragment_job on Job {
				id
				slug
				title
				description
				descriptionCleaned
				updatedAt
				skills
				minExperience
				maxExperience
				minSalary
				maxSalary
				currency
				type
				workMode
				location
				createdAt
				organization {
					id
					slug
					name
					logoUrl
					location
				}
			}
		`,
		jobKey
	);

	const formatSalary = () => {
		if (!job.minSalary && !job.maxSalary) return 'Not disclosed';
		const currency = job.currency || 'INR';
		if (job.minSalary && job.maxSalary) {
			return `${currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
		}
		if (job.minSalary) {
			return `${currency} ${job.minSalary.toLocaleString()}+`;
		}
		return `Up to ${currency} ${job.maxSalary?.toLocaleString()}`;
	};

	const formatExperience = () => {
		if (!job.minExperience && !job.maxExperience) return 'Not specified';
		if (job.minExperience && job.maxExperience) {
			return `${job.minExperience} - ${job.maxExperience} years`;
		}
		if (job.minExperience) {
			return `${job.minExperience}+ years`;
		}
		return `Up to ${job.maxExperience} years`;
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-start gap-3'>
				<Avatar
					src={job.organization?.logoUrl || ''}
					name={job.organization?.name || 'Company'}
					size='lg'
					classNames={{
						base: 'flex-shrink-0'
					}}
				/>
				<div className='flex-1 min-w-0'>
					<h2 className='text-xl font-bold mb-1 line-clamp-2'>{job.title}</h2>
					<p className='text-sm text-default-500'>{job.organization?.name}</p>
				</div>
			</div>

			<div className='flex flex-wrap gap-2'>
				<Chip startContent={<MapPin className='w-3 h-3' />} variant='flat' size='sm'>
					{job.location || 'Location not specified'}
				</Chip>
				<Chip startContent={<Briefcase className='w-3 h-3' />} variant='flat' size='sm'>
					{job.type || 'Full Time'} • {job.workMode || 'On Site'}
				</Chip>
				<Chip startContent={<DollarSign className='w-3 h-3' />} variant='flat' size='sm'>
					{formatSalary()}
				</Chip>
				<Chip startContent={<Clock className='w-3 h-3' />} variant='flat' size='sm'>
					{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
				</Chip>
			</div>

			<div>
				<h3 className='font-semibold mb-2'>Experience Required</h3>
				<p className='text-sm text-default-600'>{formatExperience()}</p>
			</div>

			{job.descriptionCleaned && (
				<div>
					<h3 className='font-semibold mb-2'>Description</h3>
					<p className='text-sm text-default-600 line-clamp-6'>{job.descriptionCleaned}</p>
				</div>
			)}

			{job.skills && job.skills.length > 0 && (
				<div>
					<h3 className='font-semibold mb-2'>Skills Required</h3>
					<div className='flex flex-wrap gap-2'>
						{job.skills.map((skill, index) => (
							<Chip key={index} size='sm' variant='bordered'>
								{skill}
							</Chip>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
