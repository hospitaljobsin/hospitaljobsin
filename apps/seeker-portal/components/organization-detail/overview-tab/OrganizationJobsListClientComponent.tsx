import type { OrganizationJobsListClientComponentQuery as OrganizationJobsListClientComponentQueryType } from '@/__generated__/OrganizationJobsListClientComponentQuery.graphql';
import { graphql, useLazyLoadQuery } from 'react-relay';
import OrganizationJobsList from './OrganizationJobsList';

const OrganizationJobsListClientComponentQuery = graphql`
  query OrganizationJobsListClientComponentQuery($slug: String!) {
    ...OrganizationJobsListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationJobsListClientComponent({ slug }: { slug: string }) {
	const data = useLazyLoadQuery<OrganizationJobsListClientComponentQueryType>(OrganizationJobsListClientComponentQuery, { slug });
	return <OrganizationJobsList rootQuery={data} />;
}
