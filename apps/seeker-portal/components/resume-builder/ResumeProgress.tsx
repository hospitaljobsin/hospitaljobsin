import type { ResumeProgressAccountFragment$key } from '@/__generated__/ResumeProgressAccountFragment.graphql';
import type { ResumeProgressFragment$key } from '@/__generated__/ResumeProgressFragment.graphql';
import { getResumeProgressColor } from '@/lib/color';
import { getRelativeTimeString } from '@/lib/intl';
import links from '@/lib/links';
import { Card, CardBody, Link, Progress } from '@heroui/react';
import { MailIcon, PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';

function getProgressText(percentage: number): string {
	if (percentage < 50) return 'weak';
	if (percentage < 65) return 'moderate';
	if (percentage < 80) return 'good';
	return 'excellent';
}

const ResumeProgressFragment = graphql`
fragment ResumeProgressFragment on Query {
    viewer {
        __typename
        ... on Account {
            ...ResumeProgressAccountFragment
        }
    }
}
`;

const ResumeProgressAccountFragment = graphql`
  fragment ResumeProgressAccountFragment on Account {
	avatarUrl
	fullName
	email
	phoneNumber
	profile @required(action: THROW) {
	  progressPercentage
	  updatedAt
	}
  }
`;

export default function ResumeProgress({ query }: { query: ResumeProgressFragment$key }) {
	const account = useFragment(ResumeProgressFragment, query);
	invariant(account.viewer.__typename === 'Account', 'Expected profile data to be present');
	const data = useFragment<ResumeProgressAccountFragment$key>(ResumeProgressAccountFragment, account.viewer);
	return (
		<>
			<Progress
				label='Profile Progress'
				size='md'
				className='w-full lg:hidden'
				value={data.profile.progressPercentage}
				color={getResumeProgressColor(data.profile.progressPercentage)}
				classNames={{ label: 'text-foreground-600 text-sm', value: 'text-foreground-600' }}
				formatOptions={{ style: 'percent', minimumFractionDigits: 0 }}
				valueLabel={`${data.profile.progressPercentage}% - ${getProgressText(data.profile.progressPercentage)}`}
				showValueLabel
				disableAnimation
			/>
			<Card className='w-full p-0 overflow-visible hidden lg:flex' shadow='none'>
				<div className='relative w-full'>
					{/* Banner */}
					<div
						className={`w-full h-32 bg-${getResumeProgressColor(data.profile.progressPercentage)}-400 rounded-t-lg flex items-center justify-end pr-6`}
					>
						<div className={`text-${getResumeProgressColor(data.profile.progressPercentage)}-foreground text-right`}>
							<div className='text-2xl font-medium opacity-80'>{data.profile.progressPercentage}% complete</div>
							<div className='text-lg opacity-75'>{getProgressText(data.profile.progressPercentage)}</div>
						</div>
					</div>
					{/* Avatar and Name */}
					<div className='absolute left-6 -bottom-10 flex items-end gap-4'>
						<Image
							src={data.avatarUrl || '/default-avatar.png'}
							alt={data.fullName}
							width={112}
							height={112}
							className='rounded-full ring-4 ring-background'
						/>
					</div>
				</div>
				<CardBody className='pt-14 pb-6 px-6'>
					<div className='flex flex-col sm:flex-row gap-6 items-start justify-between w-full'>
						<div className='flex flex-col gap-4'>
							<h1 className='text-2xl font-medium'>{data.fullName}</h1>
							<div className='flex flex-col gap-4 text-foreground-600 text-sm'>
								<div className='flex items-start gap-6'>
									<div className='flex items-center gap-2'>
										<MailIcon size={16} />
										{data.email}
									</div>
									{data.phoneNumber && (
										<div className='flex items-center gap-2'>
											<PhoneIcon size={16} />
											{data.phoneNumber}
										</div>
									)}
								</div>
								<Link href={links.accountSettings} color='foreground' showAnchorIcon isExternal>
									Account Settings
								</Link>
							</div>
						</div>
						<div className='flex flex-col sm:items-end gap-4 text-sm text-foreground-500 h-full'>
							<p className='text-foreground-500 text-sm'>Last updated {getRelativeTimeString(data.profile.updatedAt)}</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
