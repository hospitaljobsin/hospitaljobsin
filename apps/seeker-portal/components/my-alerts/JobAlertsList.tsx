import type { JobAlertsListFragment$key } from '@/__generated__/JobAlertsListFragment.graphql';
import type { MyJobAlertsClientComponentQuery } from '@/__generated__/MyJobAlertsClientComponentQuery.graphql';
import JobAlertsListSkeleton from '@/components/landing/JobListSkeleton';
import { Button } from '@heroui/react';
import { PlusIcon, SendIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import CreateJobAlertModal from './CreateJobAlertModal';
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
				<div className='w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6 border-2 border-dashed border-foreground-300 rounded-md p-6 items-center justify-center'>
					<div className='flex flex-col gap-4 items-center text-foreground-600'>
						<SendIcon size={48} />
						<h2 className='text-lg font-medium'>No job alerts Yet</h2>
						<Button color='primary' startContent={<PlusIcon />} onPress={() => setShowCreateJobAlertModal(true)}>
							Create Job Alert
						</Button>
					</div>
				</div>
				<CreateJobAlertModal isOpen={showCreateJobAlertModal} onOpenChange={setShowCreateJobAlertModal} />
			</>
		);
	}

	return (
		<div className='w-full flex flex-col gap-8 pb-6'>
			{data.jobAlerts.edges.map(jobEdge => (
				<JobAlert jobAlert={jobEdge.node} key={jobEdge.node.id} />
			))}
			<div ref={observerRef} className='h-10' />
			{isLoadingNext && <JobAlertsListSkeleton />}
		</div>
	);
}
