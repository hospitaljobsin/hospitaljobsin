import MyJobAlertsClientComponentQuery, {
	type MyJobAlertsClientComponentQuery as MyJobAlertsClientComponentQueryType
} from '@/__generated__/MyJobAlertsClientComponentQuery.graphql';
import type { MyJobAlertsViewFragment$key } from '@/__generated__/MyJobAlertsViewFragment.graphql';
import { graphql, type PreloadedQuery, useFragment, usePreloadedQuery } from 'react-relay';
import DashboardHeader from '../layout/DashboardHeader';
import JobAlertsList from './JobAlertsList';
import EnableWhatsappAlerts from './SetWhatsappAlerts';

const MyJobAlertsViewFragment = graphql`
  fragment MyJobAlertsViewFragment on Query {
    ...DashboardHeaderFragment
    ...JobAlertsListFragment
	...SetWhatsappAlertsFragment
  }
`;

interface MyJobAlertsViewProps {
	queryReference: PreloadedQuery<MyJobAlertsClientComponentQueryType>;
}

export default function MyJobAlertsView(props: MyJobAlertsViewProps) {
	const root = usePreloadedQuery(MyJobAlertsClientComponentQuery, props.queryReference);
	const data = useFragment<MyJobAlertsViewFragment$key>(MyJobAlertsViewFragment, root);

	return (
		<div className='w-full flex flex-col flex-1 h-full'>
			<DashboardHeader query={data} />
			<div className='w-full mx-auto bg-background-600'>
				<div className='w-full px-5 max-w-7xl mx-auto py-6 flex flex-col md:flex-row gap-12'>
					<JobAlertsList rootQuery={data} />
					<EnableWhatsappAlerts query={data} />
				</div>
			</div>
		</div>
	);
}
