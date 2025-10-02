import { Button, Card, CardBody } from '@heroui/react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useCallback, useTransition } from 'react';
import { useFragment, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { JobListFragment$key } from '@/__generated__/JobListFragment.graphql';
import type { JobListInternalFragment$key } from '@/__generated__/JobListInternalFragment.graphql';
import type { LandingClientComponentQuery } from '@/__generated__/LandingClientComponentQuery.graphql';
import Job from './Job';

const JobListFragment = graphql`
fragment JobListFragment on Query {
	...JobListInternalFragment @arguments(workMode: [], jobType: [])
	viewer {
		...JobControlsAuthFragment
	}
}
`;

const JobListInternalFragment = graphql`
  fragment JobListInternalFragment on Query
  @refetchable(queryName: "JobListRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
	workMode: { type: "[JobWorkModeFilter!]!" }
	jobType: { type: "[JobTypeFilter!]!" }
	sortBy: { type: "JobSearchSortBy", defaultValue: UPDATED_AT }
  ){
    jobs(after: $cursor, first: $count, workMode: $workMode, jobType: $jobType, sortBy: $sortBy)
      @connection(key: "JobListFragment_jobs") {
      edges {
        node {
          id
          ...JobFragment
		  ...JobControlsFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
	rootQuery: JobListFragment$key;
};

export default function JobList({ rootQuery }: Props) {
	const [_isPending, startTransition] = useTransition();
	const root = useFragment(JobListFragment, rootQuery);
	const { data } = usePaginationFragment<LandingClientComponentQuery, JobListInternalFragment$key>(JobListInternalFragment, root);

	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
		Autoplay({ delay: 4000, stopOnMouseEnter: true, stopOnInteraction: false })
	]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	if (data.jobs.edges.length === 0 && !data.jobs.pageInfo.hasNextPage) {
		return (
			<Card className='p-6' fullWidth shadow='none' style={{ background: 'transparent' }}>
				<CardBody className='flex flex-col gap-6 w-full items-center'>
					<div className='flex flex-col items-center'>
						{/* Simple monochrome icon (e.g., magnifying glass) */}
						<Search className='text-foreground-800' size={35} />
					</div>
					<div className='w-full flex flex-col gap-2 items-center'>
						<h2 className='font-medium text-muted-foreground text-base'>No Jobs found</h2>
						<p className='text-muted-foreground text-sm text-center max-w-xs'>Please try again later.</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<>
			<div className='md:hidden flex flex-col gap-4 w-full'>
				{data.jobs.edges.map(jobEdge => (
					<Job key={jobEdge.node.id} job={jobEdge.node} authQueryRef={root.viewer} />
				))}
			</div>
			<div className='hidden md:block relative w-full'>
				<div className='overflow-hidden -mx-4' ref={emblaRef}>
					<div className='flex'>
						{data.jobs.edges.map(jobEdge => (
							<div key={jobEdge.node.id} className='flex-[0_0_100%] min-w-0 px-4'>
								<Job job={jobEdge.node} authQueryRef={root.viewer} />
							</div>
						))}
					</div>
				</div>
				<Button
					isIconOnly
					size='sm'
					variant='bordered'
					className='absolute -left-4 top-1/2 -translate-y-1/2 z-10 shadow-sm'
					onPress={scrollPrev}
				>
					<ChevronLeft size={16} />
				</Button>
				<Button
					isIconOnly
					size='sm'
					variant='bordered'
					className='absolute -right-4 top-1/2 -translate-y-1/2 z-10 shadow-sm'
					onPress={scrollNext}
				>
					<ChevronRight size={16} />
				</Button>
			</div>
		</>
	);
}
