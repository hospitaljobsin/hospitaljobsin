'use client';
import { Card, CardBody } from '@heroui/react';
import { BadgeCheck, Briefcase, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { OrganizationCardFragment$key } from '@/__generated__/OrganizationCardFragment.graphql';
import links from '@/lib/links';

const OrganizationCardFragment = graphql`
	fragment OrganizationCardFragment on Organization {
		id
		name
		slug
		descriptionCleaned
		location
		logoUrl
		verificationStatus {
			__typename
		}
		jobs(first: 1, isActive: true) {
			totalCount
		}
	}
`;

interface OrganizationCardProps {
	organization: OrganizationCardFragment$key;
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
	const data = useFragment(OrganizationCardFragment, organization);

	return (
		<Link href={links.organizationDetail(data.slug)}>
			<Card className='w-full cursor-pointer h-full' shadow='none'>
				<CardBody className='flex flex-col gap-4 p-6'>
					<div className='flex items-start gap-4'>
						<Image src={data.logoUrl} alt={data.name} width={64} height={64} className='rounded-lg object-cover' />
						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-2'>
								<h3 className='text-lg font-semibold text-foreground-600 truncate'>{data.name}</h3>
								{data.verificationStatus.__typename === 'Verified' && <BadgeCheck className='w-5 h-5 text-primary-600 flex-shrink-0' />}
							</div>
							{data.location && (
								<div className='flex items-center gap-1 text-sm text-foreground-500 mt-1'>
									<MapPin className='w-4 h-4' />
									<span className='truncate'>{data.location}</span>
								</div>
							)}
						</div>
					</div>

					{data.descriptionCleaned && <p className='text-sm text-foreground-500 line-clamp-2'>{data.descriptionCleaned}</p>}

					{data.jobs.totalCount && (
						<div className='flex items-center gap-2 text-sm text-foreground-500 mt-auto'>
							<Briefcase className='w-4 h-4' />
							<span>
								{data.jobs.totalCount} {data.jobs.totalCount === 1 ? 'job' : 'jobs'} available
							</span>
						</div>
					)}
				</CardBody>
			</Card>
		</Link>
	);
}
