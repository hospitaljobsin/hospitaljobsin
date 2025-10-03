import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Tooltip } from '@heroui/react';
import { BookmarkCheckIcon, BookmarkIcon, MoreVertical, Share, Share2Icon } from 'lucide-react';
import { useState } from 'react';
import { ConnectionHandler, graphql, useFragment, useMutation } from 'react-relay';
import type { JobControlsAuthFragment$key } from '@/__generated__/JobControlsAuthFragment.graphql';
import type { JobControlsFragment$key } from '@/__generated__/JobControlsFragment.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import ShareJobModal from './ShareJobModal';

export const JobControlsAuthFragment = graphql`
  fragment JobControlsAuthFragment on ViewerPayload {
		__typename
  }
`;

export const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isSaved
	...ShareJobModalFragment
  }
`;

const JobControlsSaveMutation = graphql`
  mutation JobControlsSaveMutation($jobId: ID!) {
    saveJob(jobId: $jobId) {
    ... on SaveJobSuccess  {
        savedJobEdge {
            node {
                id
                ...JobDetailsInternalFragment
                ...JobControlsFragment
                }
            }
        }
    }
  }
`;

const JobControlsUnsaveMutation = graphql`
  mutation JobControlsUnsaveMutation($jobId: ID!) {
    unsaveJob(jobId: $jobId) {
    ... on UnsaveJobSuccess {
        savedJobEdge {
            node {
            id
            ...JobDetailsInternalFragment
            ...JobControlsFragment
        }
        }
    }
    }
  }
`;

export default function JobControls({
	job,
	authQueryRef: rootQuery
}: {
	job: JobControlsFragment$key;
	authQueryRef: JobControlsAuthFragment$key;
}) {
	const data = useFragment(JobControlsFragment, job);
	const authData = useFragment(JobControlsAuthFragment, rootQuery);
	const isAuthenticated = authData.__typename === 'Account';
	const [commitSaveMutation, isSaveMutationInFlight] = useMutation(JobControlsSaveMutation);
	const [commitUnsaveMutation, isUnsaveMutationInFlight] = useMutation(JobControlsUnsaveMutation);
	const [showShareModal, setShowShareModal] = useState(false);

	function handleSave() {
		commitSaveMutation({
			variables: {
				jobId: data.id
			},
			updater: store => {
				// Retrieve the connection from the store
				const rootRecord = store.getRoot();
				const connectionRecord = ConnectionHandler.getConnection(rootRecord, 'SavedJobListFragment_savedJobs');

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connectionRecord && jobRecord) {
					const newEdge = ConnectionHandler.createEdge(store, connectionRecord, jobRecord, 'SavedJobsListEdge');
					ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
				}
			}
		});
	}

	function handleUnsave() {
		commitUnsaveMutation({
			variables: {
				jobId: data.id
			},
			updater: store => {
				// Retrieve the connection from the store
				const rootRecord = store.getRoot();
				const connectionRecord = ConnectionHandler.getConnection(rootRecord, 'SavedJobListFragment_savedJobs');

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connectionRecord && jobRecord) {
					ConnectionHandler.deleteNode(connectionRecord, jobRecord.getDataID());
				}
			}
		});
	}

	return (
		<>
			{/* Desktop view */}
			<div className='hidden sm:flex items-center gap-4'>
				{!isAuthenticated ? (
					<Tooltip
						showArrow
						content={
							<div className='px-1 py-2'>
								<div className='text-sm'>
									<Link href={links.login(env.NEXT_PUBLIC_URL)} isExternal size='sm'>
										Sign in
									</Link>{' '}
									to save this job
								</div>
							</div>
						}
					>
						<span>
							<Button size='lg' isIconOnly variant='light' isDisabled>
								<BookmarkIcon size={24} strokeWidth={1.5} className='text-foreground-500' />
							</Button>
						</span>
					</Tooltip>
				) : data.isSaved ? (
					<Tooltip content='Unsave job'>
						<Button
							size='lg'
							variant='light'
							isIconOnly
							data-prevent-progress={true}
							onClick={event => {
								event.preventDefault();
								handleUnsave();
							}}
							isLoading={isUnsaveMutationInFlight}
							isDisabled={isSaveMutationInFlight}
						>
							<BookmarkCheckIcon size={24} strokeWidth={1.5} className='text-foreground-500' />
						</Button>
					</Tooltip>
				) : (
					<Tooltip content='Save job'>
						<Button
							size='lg'
							variant='light'
							isIconOnly
							data-prevent-progress={true}
							onClick={event => {
								event.preventDefault();
								handleSave();
							}}
							isLoading={isSaveMutationInFlight}
							isDisabled={isUnsaveMutationInFlight}
						>
							<BookmarkIcon size={24} strokeWidth={1.5} className='text-foreground-500' />
						</Button>
					</Tooltip>
				)}
				<Tooltip content='Share job'>
					<Button
						size='lg'
						variant='light'
						isIconOnly
						data-prevent-progress={true}
						onPress={() => {
							setShowShareModal(true);
						}}
						isLoading={isSaveMutationInFlight}
						isDisabled={isUnsaveMutationInFlight}
					>
						<Share2Icon size={24} strokeWidth={1.5} className='text-foreground-500' />
					</Button>
				</Tooltip>
			</div>

			{/* Mobile view */}
			<div className='sm:hidden'>
				<Dropdown>
					<DropdownTrigger>
						<Button size='lg' isIconOnly variant='light'>
							<MoreVertical size={24} strokeWidth={1.5} className='text-foreground-500' />
						</Button>
					</DropdownTrigger>
					<DropdownMenu>
						{!isAuthenticated ? (
							<DropdownItem key='save' isDisabled startContent={<BookmarkIcon size={16} />} description='Sign in to save jobs'>
								Save job
							</DropdownItem>
						) : data.isSaved ? (
							<DropdownItem key='unsave' startContent={<BookmarkCheckIcon size={16} />} onPress={() => handleUnsave()}>
								Unsave job
							</DropdownItem>
						) : (
							<DropdownItem key='save' startContent={<BookmarkIcon size={16} />} onPress={() => handleSave()}>
								Save job
							</DropdownItem>
						)}
						<DropdownItem key='share' startContent={<Share size={16} />} onPress={() => setShowShareModal(true)}>
							Share job
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<ShareJobModal
				job={data}
				isOpen={showShareModal}
				onClose={() => {
					setShowShareModal(false);
				}}
			/>
		</>
	);
}
