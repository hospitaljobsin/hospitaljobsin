'use client';
import { graphql, readInlineData } from 'react-relay';
import type { SiteStatsFragment$key } from '@/__generated__/SiteStatsFragment.graphql';

const SiteStatsFragment = graphql`
 fragment SiteStatsFragment on Query @inline {
        stats {
            totalJobs
            totalVacancies
            totalOrganizations
        }
  }
`;

export default function SiteStats(props: { rootQuery: SiteStatsFragment$key }) {
	const data = readInlineData(SiteStatsFragment, props.rootQuery);

	const formatStat = (value: number | null | undefined): string => {
		if (!value) return '0+';
		return (Math.round(value / 5) * 5).toLocaleString() + '+';
	};

	return (
		<div className='w-full'>
			<div className='md:grid flex items-center justify-between md:grid-cols-3 gap-8 w-full'>
				<div className='text-center md:text-left'>
					<div className='text-4xl font-medium text-primary-foreground'>{formatStat(data.stats?.totalJobs)}</div>
					<div className='text-base text-foreground-100'>Jobs</div>
				</div>
				<div className='text-center md:text-left'>
					<div className='text-4xl font-medium text-primary-foreground'>{formatStat(data.stats?.totalVacancies)}</div>
					<div className='text-base text-foreground-100'>Vacancies</div>
				</div>
				<div className='text-center md:text-left'>
					<div className='text-4xl font-medium text-primary-foreground'>{formatStat(data.stats?.totalOrganizations)}</div>
					<div className='text-base text-foreground-100'>Recruiters</div>
				</div>
			</div>
		</div>
	);
}
