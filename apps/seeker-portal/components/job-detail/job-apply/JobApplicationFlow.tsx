'use client';

import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import type { JobApplicationFlowFragment$key } from '@/__generated__/JobApplicationFlowFragment.graphql';
import type { JobApplicationFlowJobFragment$key } from '@/__generated__/JobApplicationFlowJobFragment.graphql';
import { useJobApplication } from '@/lib/hooks/useJobApplication';
import ConfirmApplicationModal from './ConfirmApplicationModal';
import CompleteProfileDrawer from './complete-profile/CompleteProfileDrawer';

const JobApplicationFlowFragment = graphql`
  fragment JobApplicationFlowFragment on Account {
    profile @required(action: THROW) {
      isComplete
    }
    ...CompleteProfileDrawerFragment
  }
`;

const JobApplicationFlowJobFragment = graphql`
  fragment JobApplicationFlowJobFragment on Job {
    id
    applicationForm {
      fields {
        __typename
      }
    }
    ...CompleteProfileDrawerJobFragment
  }
`;

interface JobApplicationFlowProps {
	account: JobApplicationFlowFragment$key;
	job: JobApplicationFlowJobFragment$key;
	children: (props: { onApply: () => void; isLoading: boolean }) => React.ReactNode;
}

export default function JobApplicationFlow({ account, job, children }: JobApplicationFlowProps) {
	const accountData = useFragment(JobApplicationFlowFragment, account);
	const jobData = useFragment(JobApplicationFlowJobFragment, job);
	const { applyForJob, isLoading } = useJobApplication();
	const [showCompleteProfileDrawer, setShowCompleteProfileDrawer] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const handleApply = () => {
		const hasApplicationFields = (jobData.applicationForm?.fields?.length || 0) > 0;
		const needsProfileCompletion = !accountData.profile.isComplete || hasApplicationFields;

		if (needsProfileCompletion) {
			setShowCompleteProfileDrawer(true);
		} else {
			setShowConfirmModal(true);
		}
	};

	const handleConfirmApply = () => {
		applyForJob(jobData.id).then(() => {
			setShowConfirmModal(false);
		});
	};

	return (
		<>
			{children({ onApply: handleApply, isLoading })}
			<CompleteProfileDrawer
				isOpen={showCompleteProfileDrawer}
				onClose={() => setShowCompleteProfileDrawer(false)}
				account={accountData}
				job={jobData}
			/>
			<ConfirmApplicationModal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onConfirm={handleConfirmApply}
				isLoading={isLoading}
			/>
		</>
	);
}
