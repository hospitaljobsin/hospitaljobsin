import type { LanguagesFragment$key } from "@/__generated__/LanguagesFragment.graphql";
import { getAnalysisColor } from "@/lib/colors";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Alert, Card, CardBody, CardHeader } from "@heroui/react";
import { LanguagesIcon, SparklesIcon, StarIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const LanguagesFragment = graphql`
  fragment LanguagesFragment on JobApplicant {
	profileSnapshot {
        __typename
        languages {
            name
            proficiency
        }
      }
    analysis {
      __typename
      ... on JobApplicantAnalysis {
        analysedFields {
          languages { analysis score }
        }
      }
    }
	}
`;

type Props = {
	rootQuery: LanguagesFragment$key;
};

export default function Languages({ rootQuery }: Props) {
	const query = useFragment(LanguagesFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis =
		query.analysis?.__typename === "JobApplicantAnalysis"
			? query.analysis.analysedFields?.languages
			: undefined;

	useCopilotReadable({
		description: "The current applicant's languages",
		value: data.languages,
	});

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<LanguagesIcon />
						<h1 className="w-full text-sm font-medium">Languages</h1>{" "}
						{analysis && (
							<span className="text-primary-600 text-sm flex items-center gap-2">
								<StarIcon size={16} />
								{Math.round(analysis.score * 100)}%
							</span>
						)}
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.languages.length < 1 ? (
						<h2 className="w-full text-foreground-500">No languages</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.languages.map((language) => (
								<div
									className="flex gap-4 flex-col items-center w-full"
									key={`${language.name}-${language.proficiency}`}
								>
									<h3 className="w-full text-foreground-500 text-lg font-medium">
										{language.name}
									</h3>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Proficiency:</p>
										<p className="italic">{language.proficiency}</p>
									</div>
								</div>
							))}
						</div>
					)}
					{analysis && (
						<Alert
							icon={<SparklesIcon size={18} />}
							hideIconWrapper
							color={getAnalysisColor(analysis.score)}
							description={analysis.analysis}
							variant="flat"
							radius="md"
						/>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
