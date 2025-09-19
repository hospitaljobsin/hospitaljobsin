import type { JobAlertsListFragment$key } from '@/__generated__/JobAlertsListFragment.graphql';
import type { MyJobAlertsClientComponentQuery } from '@/__generated__/MyJobAlertsClientComponentQuery.graphql';
import JobAlertsListSkeleton from '@/components/landing/JobListSkeleton';
import { MAX_JOB_ALERTS_PER_ACCOUNT } from '@/lib/constants';
import { Button, Tooltip } from '@heroui/react';
import { PlusIcon, SendIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import CreateJobAlertModal from './create-job-alert/CreateJobAlertModal';
import JobAlert from './JobAlert';

const JobAlertsListFragment = graphql`
  fragment JobAlertsListFragment on Query
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  )
  @refetchable(queryName: "JobAlertsListPaginationQuery") {
    jobAlerts(after: $cursor, first: $count)
      @connection(key: "JobAlertsListFragment_jobAlerts") {
		totalCount @required(action: THROW)
      edges {
        node {
          id
          ...JobAlertFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: JobAlertsListFragment$key;
};

export default function JobAlertsList({ rootQuery }: Props) {
	const [showCreateJobAlertModal, setShowCreateJobAlertModal] = useState(false);
	const { data, loadNext, isLoadingNext } = usePaginationFragment<MyJobAlertsClientComponentQuery, JobAlertsListFragment$key>(
		JobAlertsListFragment,
		rootQuery
	);

	const observerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			entries => {
				const entry = entries[0];
				if (entry.isIntersecting && data.jobAlerts.pageInfo.hasNextPage && !isLoadingNext) {
					loadNext(25);
				}
			},
			{ threshold: 1.0 }
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [data.jobAlerts.pageInfo.hasNextPage, isLoadingNext, loadNext]);

	if (data.jobAlerts.edges.length === 0 && !data.jobAlerts.pageInfo.hasNextPage) {
		return (
			<>
				<div className='flex flex-col w-full h-full gap-12'>
					<div className='flex flex-col sm:flex-row justify-between sm:items-center gap-6'>
						<div className='space-y-2'>
							<h2 className='text-2xl font-medium'>My Job Alerts</h2>
							<p className='text-sm text-foreground-600'>Get notified when new jobs match your preferences, directly in your inbox</p>
						</div>
						{data.jobAlerts.totalCount >= MAX_JOB_ALERTS_PER_ACCOUNT ? (
							<Tooltip
								content={`You have reached the maximum of ${MAX_JOB_ALERTS_PER_ACCOUNT} job alerts. Please delete an existing alert to create a new one.`}
								showArrow
							>
								<span>
									<Button color='primary' size='lg' startContent={<PlusIcon />} isDisabled>
										Create Job Alert
									</Button>
								</span>
							</Tooltip>
						) : (
							<Button color='primary' size='lg' startContent={<PlusIcon />} onPress={() => setShowCreateJobAlertModal(true)}>
								Create Job Alert
							</Button>
						)}
					</div>
					<div className='w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6 border-2 border-dashed border-foreground-300 rounded-md p-6 items-center justify-center'>
						<div className='flex flex-col gap-4 items-center text-foreground-600'>
							<SendIcon size={48} />
							<h2 className='text-lg font-medium'>No job alerts Yet</h2>
						</div>
					</div>
				</div>
				<CreateJobAlertModal isOpen={showCreateJobAlertModal} onOpenChange={setShowCreateJobAlertModal} />
			</>
		);
	}

	return (
		<>
			<div className='flex flex-col w-full h-full gap-12'>
				<div className='flex flex-col sm:flex-row justify-between sm:items-center gap-6'>
					<div className='space-y-2'>
						<h2 className='text-2xl font-medium'>My Job Alerts</h2>
						<p className='text-sm text-foreground-600'>Get notified when new jobs match your preferences, directly in your inbox</p>
					</div>
					{data.jobAlerts.totalCount >= MAX_JOB_ALERTS_PER_ACCOUNT ? (
						<Tooltip
							content={`You have reached the maximum of ${MAX_JOB_ALERTS_PER_ACCOUNT} job alerts. Please delete an existing alert to create a new one.`}
							showArrow
						>
							<span>
								<Button color='primary' size='lg' startContent={<PlusIcon />} isDisabled>
									Create Job Alert
								</Button>
							</span>
						</Tooltip>
					) : (
						<Button color='primary' size='lg' startContent={<PlusIcon />} onPress={() => setShowCreateJobAlertModal(true)}>
							Create Job Alert
						</Button>
					)}
				</div>
				<div className='w-full flex flex-col gap-8 pb-6'>
					{data.jobAlerts.edges.map(jobEdge => (
						<JobAlert jobAlert={jobEdge.node} key={jobEdge.node.id} />
					))}
					<div ref={observerRef} className='h-10' />
					{isLoadingNext && <JobAlertsListSkeleton />}
				</div>
			</div>
			<CreateJobAlertModal isOpen={showCreateJobAlertModal} onOpenChange={setShowCreateJobAlertModal} />
		</>
	);
}
