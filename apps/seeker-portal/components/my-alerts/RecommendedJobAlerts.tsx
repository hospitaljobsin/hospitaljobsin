import { addToast, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ConnectionHandler, graphql, useFragment, useMutation } from 'react-relay';
import type { RecommendedJobAlertsEnableMutation as EnableRecommendedJobAlertsMutationType } from '@/__generated__/RecommendedJobAlertsEnableMutation.graphql';
import type { RecommendedJobAlertsFragment$key } from '@/__generated__/RecommendedJobAlertsFragment.graphql';
import RemoveRecommendedJobAlertsModal from './RemoveRecommendedJobAlertsModal';

const RecommendedJobAlertsFragment = graphql`
  fragment RecommendedJobAlertsFragment on Query {
    recommendedJobAlerts(first: 10) {
      edges {
        node {
          id
          filters {
            searchTerm
            location
            minExperience
            maxExperience
            minSalary
            maxSalary
            jobType
            workMode
          }
        }
      }
      totalCount
    }
  }
`;

const EnableRecommendedJobAlertsMutation = graphql`
  mutation RecommendedJobAlertsEnableMutation($frequency: JobAlertFrequency!) {
    enableRecommendedJobAlerts(frequency: $frequency) {
      __typename
      ... on EnableRecommendedJobAlertsSuccess {
        jobAlertEdges {
          node {
            id
            ...JobAlertFragment
          }
        }
        removedRecommendedJobAlertIds // TODO: delete edge here instead
      }
      ... on RecommendedJobAlertsNotFoundError {
        message
      }
    }
  }
`;

interface RecommendedJobAlertsProps {
	query: RecommendedJobAlertsFragment$key;
}

export default function RecommendedJobAlerts({ query }: RecommendedJobAlertsProps) {
	const data = useFragment(RecommendedJobAlertsFragment, query);
	const [isEnabling, setIsEnabling] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [enableRecommendedJobAlerts] = useMutation<EnableRecommendedJobAlertsMutationType>(EnableRecommendedJobAlertsMutation);

	const handleEnableRecommendedJobAlerts = () => {
		setIsEnabling(true);

		enableRecommendedJobAlerts({
			variables: {
				frequency: 'DAILY'
			},
			onCompleted: response => {
				setIsEnabling(false);
				if (response.enableRecommendedJobAlerts.__typename === 'EnableRecommendedJobAlertsSuccess') {
					addToast({ title: 'Recommended job alerts enabled successfully!' });
				} else if (response.enableRecommendedJobAlerts.__typename === 'RecommendedJobAlertsNotFoundError') {
					addToast({ title: response.enableRecommendedJobAlerts.message });
				}
			},
			onError: () => {
				setIsEnabling(false);
				addToast({ title: 'Failed to enable recommended job alerts' });
			},
			updater: (store, responseData) => {
				if (responseData && responseData.enableRecommendedJobAlerts.__typename === 'EnableRecommendedJobAlertsSuccess') {
					const root = store.getRoot();
					const connectionRecord = ConnectionHandler.getConnection(root, 'JobAlertsListFragment_jobAlerts');

					for (const edge of responseData.enableRecommendedJobAlerts.jobAlertEdges) {
						const jobAlertRecord = store.get(edge.node.id);
						if (connectionRecord && jobAlertRecord) {
							const newEdge = ConnectionHandler.createEdge(store, connectionRecord, jobAlertRecord, 'JobAlertEdge');
							ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
						}
					}
				}
			}
		});
	};

	if (!data.recommendedJobAlerts.edges.length) {
		return null;
	}

	return (
		<Card className='p-6' shadow='none'>
			<CardHeader className='pb-3 flex flex-col gap-1 items-start'>
				<div className='flex items-center gap-2'>
					<Sparkles className='h-5 w-5 text-foreground-600' />
					<h3 className='text-lg font-medium text-foreground-600'>Recommended Job Alerts</h3>
				</div>
				<p className='text-sm text-default-500'>
					We found {data.recommendedJobAlerts.totalCount} job alert{data.recommendedJobAlerts.totalCount !== 1 ? 's' : ''} that might
					interest you based on your profile
				</p>
			</CardHeader>
			<CardBody className='space-y-4'>
				<div className='space-y-3'>
					{data.recommendedJobAlerts.edges.map(({ node }) => (
						<div key={node.id} className='space-y-1'>
							<div className='font-medium'>{node.filters.searchTerm}</div>
							<div className='flex flex-wrap gap-2 text-sm text-default-500'>
								{node.filters.location && <span>{node.filters.location}</span>}
								{node.filters.minExperience !== null && node.filters.maxExperience !== null && (
									<span>
										{node.filters.minExperience}-{node.filters.maxExperience} years exp
									</span>
								)}
								{node.filters.minSalary && node.filters.maxSalary && (
									<span>
										₹{node.filters.minSalary / 100000}L - ₹{node.filters.maxSalary / 100000}L
									</span>
								)}
								{node.filters.jobType?.map(type => (
									<span key={type}>{type.replace('_', ' ')}</span>
								))}
								{node.filters.workMode?.map(mode => (
									<span key={mode}>{mode}</span>
								))}
							</div>
						</div>
					))}
				</div>

				<div className='flex gap-6 w-full pt-6'>
					<Button variant='flat' onPress={() => setIsModalOpen(true)} fullWidth>
						No thanks
					</Button>
					<Button color='primary' onPress={handleEnableRecommendedJobAlerts} isLoading={isEnabling} fullWidth>
						Enable these alerts
					</Button>
				</div>

				<RemoveRecommendedJobAlertsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => {}} />
			</CardBody>
		</Card>
	);
}
