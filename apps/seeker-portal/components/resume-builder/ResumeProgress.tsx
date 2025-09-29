import type { ResumeProgressAccountFragment$key } from '@/__generated__/ResumeProgressAccountFragment.graphql';
import type { ResumeProgressFragment$key } from '@/__generated__/ResumeProgressFragment.graphql';
import { getResumeProgressColor } from '@/lib/color';
import { Button, Progress, Tooltip } from '@heroui/react';
import { SparkleIcon } from 'lucide-react';
import { useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import AutofillWithAIModal from './AutofillWithAIModal';

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
	profile @required(action: THROW) {
	  progressPercentage
	}
  }
`;

export default function ResumeProgress({ query }: { query: ResumeProgressFragment$key }) {
	const account = useFragment(ResumeProgressFragment, query);
	const [showAIModal, setShowAIModal] = useState(false);
	invariant(account.viewer.__typename === 'Account', 'Expected profile data to be present');
	const data = useFragment<ResumeProgressAccountFragment$key>(ResumeProgressAccountFragment, account.viewer);
	return (
		<>
			<div className='w-full max-w-7xl mx-auto px-4 pb-6 pt-6 md:pt-12 lg:px-8 mb-4'>
				<div className='flex justify-between items-center gap-6 sm:gap-12 lg:grid lg:grid-cols-12'>
					<Progress
						label='Resume Progress'
						size='md'
						value={data.profile.progressPercentage}
						color={getResumeProgressColor(data.profile.progressPercentage)}
						className='w-full lg:col-span-9'
						classNames={{ label: 'text-foreground-600 text-sm', value: 'text-foreground-600' }}
						showValueLabel
						disableAnimation
					/>
					<Button
						className='min-w-64 hidden sm:flex lg:col-span-3'
						startContent={<SparkleIcon size={18} />}
						onPress={() => setShowAIModal(true)}
					>
						Autofill With AI
					</Button>
					<Tooltip content='Use AI to help fill out your resume faster.' className='sm:hidden'>
						<Button className='sm:hidden' isIconOnly onPress={() => setShowAIModal(true)}>
							<SparkleIcon size={18} />
						</Button>
					</Tooltip>
				</div>
			</div>
			<AutofillWithAIModal onClose={() => setShowAIModal(false)} isOpen={showAIModal} />
		</>
	);
}
