import type { AboutMeFragment$data, AboutMeFragment$key } from '@/__generated__/AboutMeFragment.graphql';
import MarkdownEditor from '@/components/forms/text-editor/MarkdownEditor';
import { getAnalysisColor } from '@/lib/colors';
import { useCopilotReadable } from '@copilotkit/react-core';
import { Alert, Card, CardBody, CardHeader } from '@heroui/react';

import { ScrollIcon, SparklesIcon, StarIcon } from 'lucide-react';
import { graphql, useFragment } from 'react-relay';

const AboutMeFragment = graphql`
  fragment AboutMeFragment on JobApplicant {
	profileSnapshot {
        professionalSummary
        headline
	}
    analysis {
      __typename
      ... on JobApplicantAnalysis {
        analysedFields {
          professionalSummary { analysis score }
          headline { analysis score }
        }
      }
    }
  }
`;
type Props = {
	rootQuery: AboutMeFragment$key;
};

type AnalysedFieldsType = NonNullable<Extract<AboutMeFragment$data['analysis'], { __typename: 'JobApplicantAnalysis' }>>['analysedFields'];

export default function AboutMe({ rootQuery }: Props) {
	const query = useFragment(AboutMeFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis = query.analysis?.__typename === 'JobApplicantAnalysis' ? query.analysis.analysedFields : undefined;

	useCopilotReadable({
		description: "The applicant's professional details",
		value: data
	});

	function calculateScore(analysis: AnalysedFieldsType) {
		const score = (analysis.professionalSummary?.score ?? 0) + (analysis.headline?.score ?? 0);
		return Math.round((score / 2) * 100 * 10) / 10;
	}

	return (
		<div className='space-y-12'>
			<Card className='p-6 space-y-6' shadow='none'>
				<CardHeader className='flex gap-6 w-full items-center justify-between'>
					<div className='flex items-center gap-2 text-foreground-400'>
						<ScrollIcon />
						<h1 className='w-full text-sm font-medium'>About the Candidate</h1>
						{analysis && (
							<span className='text-primary-600 text-sm flex items-center gap-2'>
								<StarIcon size={16} />
								{calculateScore(analysis)}%
							</span>
						)}
					</div>
				</CardHeader>
				<CardBody className='flex flex-col gap-8'>
					<div className='flex flex-col gap-6 w-full items-center justify-start'>
						<h1 className='w-full font-medium'>Headline</h1>
						{!data.headline ? (
							<h2 className='w-full text-foreground-500'>No headline provided</h2>
						) : (
							<h2 className='w-full text-foreground-500'>{data.headline}</h2>
						)}
						{analysis?.headline && (
							<Alert
								icon={<SparklesIcon size={18} />}
								hideIconWrapper
								color={getAnalysisColor(analysis.headline.score)}
								description={analysis.headline.analysis}
								variant='flat'
								radius='md'
							/>
						)}
					</div>
					<div className='flex items-start flex-col gap-4'>
						<div className='block mb-2 font-medium'>Professional Summary</div>
						{data.professionalSummary ? (
							<MarkdownEditor initialValue={data.professionalSummary} editable={false} className='w-full' />
						) : (
							<span className='text-foreground-500'>No professional summary provided</span>
						)}
						{analysis?.professionalSummary && (
							<Alert
								icon={<SparklesIcon size={18} />}
								hideIconWrapper
								color={getAnalysisColor(analysis.professionalSummary.score)}
								description={analysis.professionalSummary.analysis}
								variant='flat'
								radius='md'
							/>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
