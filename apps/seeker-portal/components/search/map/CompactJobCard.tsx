'use client';

import { Card, CardBody, Chip, Tooltip } from '@heroui/react';
import { Briefcase, IndianRupee, MapPin, VerifiedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { graphql, useFragment } from 'react-relay';
import type { CompactJobCard_job$key } from '@/__generated__/CompactJobCard_job.graphql';

// GraphQL fragment for CompactJobCard component
export const CompactJobCardFragment = graphql`
	fragment CompactJobCard_job on Job {
		id
		slug
		title
		location
		minSalary
		maxSalary
		currency
		minExperience
		maxExperience
		type
		workMode
		skills
		organization {
			name
			slug
			logoUrl
			verificationStatus {
				... on Verified {
					verifiedAt
				}
			}
		}
	}
`;

interface CompactJobCardProps {
	job: CompactJobCard_job$key;
	href?: string;
	onClick?: () => void;
	className?: string;
	showOrganization?: boolean;
}

/**
 * CompactJobCard Component
 *
 * A compact job card designed for map clusters using Relay fragments.
 * Optimized for small spaces while showing essential job information.
 */
export default function CompactJobCard({ job: jobKey, href, onClick, className = '', showOrganization = true }: CompactJobCardProps) {
	const job = useFragment(CompactJobCardFragment, jobKey);

	const formatSalary = () => {
		if (!job.minSalary && !job.maxSalary) return null;

		const currency = job.currency || 'INR';
		const symbol = currency === 'INR' ? '₹' : '$';

		if (job.minSalary && job.maxSalary) {
			const min = (job.minSalary / 1000).toFixed(0);
			const max = (job.maxSalary / 1000).toFixed(0);
			return `${symbol}${min}K - ${symbol}${max}K`;
		}

		if (job.minSalary) {
			const min = (job.minSalary / 1000).toFixed(0);
			return `${symbol}${min}K+`;
		}

		if (job.maxSalary) {
			const max = (job.maxSalary / 1000).toFixed(0);
			return `Up to ${symbol}${max}K`;
		}

		return null;
	};

	const formatExperience = () => {
		if (!job.minExperience && !job.maxExperience) return null;

		if (job.minExperience && job.maxExperience) {
			if (job.minExperience === job.maxExperience) {
				return `${job.minExperience}y`;
			}
			return `${job.minExperience}-${job.maxExperience}y`;
		}

		if (job.minExperience) {
			return `${job.minExperience}y+`;
		}

		if (job.maxExperience) {
			return `Up to ${job.maxExperience}y`;
		}

		return null;
	};

	const formatJobType = (type: string | null) => {
		if (!type) return null;

		const typeMap = {
			FULL_TIME: 'Full-time',
			PART_TIME: 'Part-time',
			CONTRACT: 'Contract',
			INTERNSHIP: 'Internship',
			LOCUM: 'Locum'
		};

		return typeMap[type as keyof typeof typeMap] || type;
	};

	const formatWorkMode = (mode: string | null) => {
		if (!mode) return null;

		const modeMap = {
			REMOTE: 'Remote',
			HYBRID: 'Hybrid',
			OFFICE: 'Office'
		};

		return modeMap[mode as keyof typeof modeMap] || mode;
	};

	const salary = formatSalary();
	const experience = formatExperience();
	const jobType = formatJobType(job.type ?? null);
	const workMode = formatWorkMode(job.workMode ?? null);
	const isVerified = !!job.organization?.verificationStatus?.verifiedAt;

	const cardContent = (
		<Card
			className={`w-full cursor-pointer transition-colors ${className}`}
			isPressable={!!href || !!onClick}
			onPress={onClick}
			shadow='none'
		>
			<CardBody className='p-4 space-y-3'>
				{/* Job Title */}

				{/* Header with Organization */}
				{showOrganization && job.organization && (
					<div className='flex items-center gap-4 min-w-0'>
						{job.organization.logoUrl && (
							<div className='relative w-12 h-12 flex-shrink-0'>
								<Image src={job.organization.logoUrl} alt={job.organization.name} fill className='rounded object-cover' sizes='48px' />
							</div>
						)}
						<div className='flex flex-col w-full gap-2'>
							<h3 className='text-base font-semibold text-foreground-900 line-clamp-2 leading-tight'>{job.title}</h3>
							<div className='flex items-center gap-1 min-w-0 flex-1'>
								<span className='text-sm text-foreground-700 truncate font-medium'>{job.organization.name}</span>
								{isVerified && (
									<Tooltip content='Verified organization' size='sm'>
										<VerifiedIcon className='w-4 h-4 text-primary flex-shrink-0' />
									</Tooltip>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Primary Salary - Most Prominent */}
				{salary && (
					<div className='flex items-center gap-2'>
						<IndianRupee size={16} className='text-foreground flex-shrink-0' />
						<span className='text-lg font-semibold'>{salary}</span>
						<span className='text-sm text-foreground-500'>/ month</span>
					</div>
				)}

				{/* Secondary Job Details */}
				<div className='flex flex-wrap gap-3 text-sm text-foreground-600'>
					{job.location && (
						<div className='flex items-center gap-1.5'>
							<MapPin size={14} className='flex-shrink-0' />
							<span className='truncate'>{job.location}</span>
						</div>
					)}

					{experience && (
						<div className='flex items-center gap-1.5'>
							<Briefcase size={14} className='flex-shrink-0' />
							<span>{experience}</span>
						</div>
					)}
				</div>

				{/* Job Type and Work Mode Chips */}
				<div className='flex gap-2 flex-wrap'>
					{jobType && (
						<Chip size='sm' variant='flat' color='primary' className='text-xs px-2 h-6'>
							{jobType}
						</Chip>
					)}

					{workMode && (
						<Chip size='sm' variant='flat' color='secondary' className='text-xs px-2 h-6'>
							{workMode}
						</Chip>
					)}
				</div>

				{/* Skills (max 3) */}
				{job.skills && job.skills.length > 0 && (
					<div className='flex gap-2 flex-wrap'>
						{job.skills.slice(0, 3).map((skill: string) => (
							<Chip key={skill} size='sm' variant='flat' color='default' className='text-xs px-2 h-6 bg-default-100'>
								{skill}
							</Chip>
						))}
						{job.skills.length > 3 && <span className='text-xs text-foreground-500 self-center'>+{job.skills.length - 3} more</span>}
					</div>
				)}
			</CardBody>
		</Card>
	);

	if (href) {
		return (
			<Link href={href} className='block w-full'>
				{cardContent}
			</Link>
		);
	}

	return cardContent;
}
