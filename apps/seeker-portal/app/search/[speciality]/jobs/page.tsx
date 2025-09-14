import type { pageSearchSpecialityMetadataFragment$key } from '@/__generated__/pageSearchSpecialityMetadataFragment.graphql';
import type SearchMetadataQueryNode from '@/__generated__/pageSearchSpecialityMetadataQuery.graphql';
import type { pageSearchSpecialityMetadataQuery } from '@/__generated__/pageSearchSpecialityMetadataQuery.graphql';
import type SearchViewLocationQueryNode from '@/__generated__/pageSearchSpecialityViewQuery.graphql';
import type { pageSearchSpecialityViewQuery } from '@/__generated__/pageSearchSpecialityViewQuery.graphql';
import { REASONABLE_JOB_COUNT } from '@/lib/constants';
import loadSerializableQuery from '@/lib/relay/loadSerializableQuery';
import { parseSearchParams } from '@/lib/searchParams';
import type { Metadata } from 'next';
import { graphql, readInlineData } from 'relay-runtime';
import SearchViewSpecialityClientComponent from './SearchViewSpecialityClientComponent';

export const PageSearchSpecialityViewQuery = graphql`
  query pageSearchSpecialityViewQuery(
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$sortBy: JobSearchSortBy!
	) {
    ...SearchViewSpecialityClientComponentFragment @arguments(
		searchTerm: $searchTerm
		minExperience: $minExperience
		minSalary: $minSalary
		maxSalary: $maxSalary
		proximityKm: $proximityKm
		workMode: $workMode
		jobType: $jobType
		sortBy: $sortBy
	)
  }
`;

const PageSearchMetadataQuery = graphql`
  query pageSearchSpecialityMetadataQuery(
		$searchTerm: String
		$minExperience: Int
		$minSalary: Int
		$maxSalary: Int
		$proximityKm: Float
		$location: String
		$workMode: [JobWorkModeFilter!]!
		$jobType: [JobTypeFilter!]!
		$sortBy: JobSearchSortBy!
	) {
	...pageSearchSpecialityMetadataFragment @arguments(
		searchTerm: $searchTerm
		minExperience: $minExperience
		minSalary: $minSalary
		maxSalary: $maxSalary
		proximityKm: $proximityKm
		location: $location
		workMode: $workMode
		jobType: $jobType
		sortBy: $sortBy
	)
  }
`;

const PageSearchMetadataFragment = graphql`
 fragment pageSearchSpecialityMetadataFragment on Query @inline @argumentDefinitions(
		searchTerm: { type: "String" }
		minExperience: { type: "Int" }
		minSalary: { type: "Int" }
		maxSalary: { type: "Int" }
		proximityKm: { type: "Float" }
		location: { type: "String" }
		workMode: { type: "[JobWorkModeFilter!]!" }
		jobType: { type: "[JobTypeFilter!]!" }
		sortBy: { type: "JobSearchSortBy!" }
    ) {
		jobs(after: null, first: 25, searchTerm: $searchTerm, proximityKm: $proximityKm, minExperience: $minExperience, minSalary: $minSalary, maxSalary: $maxSalary, workMode: $workMode, jobType: $jobType, sortBy: $sortBy, location: $location) {
			totalCount
		}
	}
`;

export async function generateMetadata({
	searchParams,
	params
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ speciality: string | string[] }>;
}): Promise<Metadata> {
	const filterParams = await searchParams;
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(specialityParam).replace(/-/g, ' ');
	const variables = parseSearchParams(filterParams);

	console.log('generating metadata for search', variables);

	try {
		const preloadedQuery = await loadSerializableQuery<typeof SearchMetadataQueryNode, pageSearchSpecialityMetadataQuery>(
			PageSearchMetadataQuery,
			{ ...variables, searchTerm: speciality, location: null }
		);

		const data = readInlineData<pageSearchSpecialityMetadataFragment$key>(PageSearchMetadataFragment, preloadedQuery.data);

		const jobCount = data.jobs.totalCount;
		const hasReasonableCount = jobCount && jobCount >= REASONABLE_JOB_COUNT;

		let title = hasReasonableCount ? `${jobCount} Medical Jobs & Healthcare Careers` : 'Medical Jobs & Healthcare Careers';
		let description = hasReasonableCount
			? `Discover ${jobCount} verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.`
			: 'Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities.';

		if (speciality) {
			// Enhance search term titles with medical context
			if (hasReasonableCount) {
				const medicalTitle =
					speciality.toLowerCase().includes('doctor') || speciality.toLowerCase().includes('physician')
						? `${jobCount} ${speciality} Positions & Medical Careers`
						: speciality.toLowerCase().includes('nurse') || speciality.toLowerCase().includes('nursing')
							? `${jobCount} ${speciality} Jobs & Healthcare Opportunities`
							: `${jobCount} ${speciality} Medical Jobs & Healthcare Careers`;

				title = medicalTitle;
				description = `Find ${jobCount} ${speciality} positions at leading healthcare institutions. Join top medical facilities as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
			} else {
				const medicalTitle =
					speciality.toLowerCase().includes('doctor') || speciality.toLowerCase().includes('physician')
						? `${speciality} Positions & Medical Careers`
						: speciality.toLowerCase().includes('nurse') || speciality.toLowerCase().includes('nursing')
							? `${speciality} Jobs & Healthcare Opportunities`
							: `${speciality} Medical Jobs & Healthcare Careers`;

				title = medicalTitle;
				description = `Find ${speciality} positions at leading healthcare institutions. Join top medical facilities as a ${speciality.toLowerCase()} with competitive salaries & benefits.`;
			}
		}

		title += " | India's Medical Job Portal";
		description += " Browse nationwide medical career opportunities across India's leading healthcare networks.";

		return {
			title,
			description
		};
	} catch (error) {
		console.error('Error generating search metadata:', error);

		// Fallback metadata
		let title = 'Medical Jobs & Healthcare Careers in India | Leading Medical Job Portal';
		let description =
			'Discover verified medical jobs for doctors, nurses, pharmacists, technicians & healthcare professionals. Apply directly to top hospitals, clinics & medical facilities across India.';

		if (speciality) {
			title = `${speciality} Medical Jobs & Healthcare Careers in India`;
			description = `Find ${speciality} positions at leading healthcare institutions across India. Join premier medical facilities with competitive salaries & comprehensive benefits.`;
		}

		return {
			title,
			description
		};
	}
}

export default async function SearchPage({
	searchParams,
	params
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
	params: Promise<{ speciality: string | string[] }>;
}) {
	const filterParams = await searchParams;
	const variables = parseSearchParams(filterParams);
	const specialityParam = (await params).speciality;
	const speciality = Array.isArray(specialityParam)
		? specialityParam
				.map(segment => decodeURIComponent(segment))
				.join('-')
				.replace(/-/g, ' ')
		: decodeURIComponent(specialityParam).replace(/-/g, ' ');

	console.log('speciality', speciality);

	const preloadedQuery = await loadSerializableQuery<typeof SearchViewLocationQueryNode, pageSearchSpecialityViewQuery>(
		PageSearchSpecialityViewQuery,
		{ ...variables, searchTerm: speciality },
		{
			metadata: {
				includeAuth: true
			}
		}
	);

	return <SearchViewSpecialityClientComponent preloadedQuery={preloadedQuery} speciality={speciality} />;
}
