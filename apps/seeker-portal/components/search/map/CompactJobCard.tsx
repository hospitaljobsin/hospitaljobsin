'use client';

import { Card, CardBody, Chip, Tooltip } from '@heroui/react';
import { Briefcase, IndianRupee, MapPin, VerifiedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CompactJobCardProps {
	job: {
		id: string;
		slug: string;
		title: string;
		location?: string | null;
		minSalary?: number | null;
		maxSalary?: number | null;
		currency?: string | null;
		minExperience?: number | null;
		maxExperience?: number | null;
		type?: string | null;
		workMode?: string | null;
		skills?: string[] | null;
		organization?: {
			name: string;
			slug?: string | null;
			logoUrl?: string | null;
			verificationStatus?: {
				verified?: boolean;
			} | null;
		} | null;
	};
	href?: string;
	onClick?: () => void;
	className?: string;
	showOrganization?: boolean;
}

/**
 * CompactJobCard Component
 *
 * A compact job card designed for map clusters and dense listings.
 * Optimized for small spaces while showing essential job information.
 */
export default function CompactJobCard({ job, href, onClick, className = '', showOrganization = true }: CompactJobCardProps) {
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

	const cardContent = (
		<Card
			className={`w-full cursor-pointer hover:shadow-md transition-shadow ${className}`}
			isPressable={!!href || !!onClick}
			shadow='sm'
			onPress={onClick}
		>
			<CardBody className='p-3 space-y-2'>
				{/* Header with Organization */}
				{showOrganization && job.organization && (
					<div className='flex items-center gap-2 min-w-0'>
						{job.organization.logoUrl && (
							<div className='relative w-6 h-6 flex-shrink-0'>
								<Image src={job.organization.logoUrl} alt={job.organization.name} fill className='rounded object-cover' sizes='24px' />
							</div>
						)}
						<div className='flex items-center gap-1 min-w-0 flex-1'>
							<span className='text-xs text-foreground-600 truncate font-medium'>{job.organization.name}</span>
							{job.organization.verificationStatus?.verified && (
								<Tooltip content='Verified organization' size='sm'>
									<VerifiedIcon className='w-3 h-3 text-primary flex-shrink-0' />
								</Tooltip>
							)}
						</div>
					</div>
				)}

				{/* Job Title */}
				<div>
					<h3 className='text-sm font-semibold text-foreground-900 line-clamp-2 leading-tight'>{job.title}</h3>
				</div>

				{/* Job Details */}
				<div className='flex flex-wrap gap-1 text-xs text-foreground-600'>
					{job.location && (
						<div className='flex items-center gap-1'>
							<MapPin size={12} className='flex-shrink-0' />
							<span className='truncate max-w-20'>{job.location}</span>
						</div>
					)}

					{experience && (
						<div className='flex items-center gap-1'>
							<Briefcase size={12} className='flex-shrink-0' />
							<span>{experience}</span>
						</div>
					)}

					{salary && (
						<div className='flex items-center gap-1'>
							<IndianRupee size={12} className='flex-shrink-0' />
							<span>{salary}</span>
						</div>
					)}
				</div>

				{/* Job Type and Work Mode Chips */}
				<div className='flex gap-1 flex-wrap'>
					{jobType && (
						<Chip size='sm' variant='flat' color='primary' className='text-xs px-1 h-5'>
							{jobType}
						</Chip>
					)}

					{workMode && (
						<Chip size='sm' variant='flat' color='secondary' className='text-xs px-1 h-5'>
							{workMode}
						</Chip>
					)}
				</div>

				{/* Skills (max 2) */}
				{job.skills && job.skills.length > 0 && (
					<div className='flex gap-1 flex-wrap'>
						{job.skills.slice(0, 2).map(skill => (
							<Chip key={skill} size='sm' variant='flat' color='default' className='text-xs px-1 h-4 bg-default-100'>
								{skill}
							</Chip>
						))}
						{job.skills.length > 2 && <span className='text-xs text-foreground-500 self-center'>+{job.skills.length - 2} more</span>}
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
