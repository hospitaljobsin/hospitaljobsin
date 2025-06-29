import type { EducationFragment$key } from "@/__generated__/EducationFragment.graphql";
import { monthYearFormat } from "@/lib/intl";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { BookIcon, SparklesIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const EducationFragment = graphql`
  fragment EducationFragment on JobApplicant {
	profileSnapshot {
    __typename
    education {
      degree
      institution
      startedAt
      completedAt
    }
}
    analysis {
      __typename
      ... on JobApplicantAnalysis {
        analysedFields {
          education { analysis score }
        }
      }
    }
  }
`;

type Props = {
	rootQuery: EducationFragment$key;
};

export default function Education({ rootQuery }: Props) {
	const query = useFragment(EducationFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis =
		query.analysis?.__typename === "JobApplicantAnalysis"
			? query.analysis.analysedFields?.education
			: undefined;

	useCopilotReadable({
		description: "The current applicant's education",
		value: data.education,
	});

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<BookIcon />
						<h1 className="w-full text-sm font-medium">Education</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{analysis && (
						<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
							<div className="flex items-center gap-4 text-medium">
								<SparklesIcon size={18} /> {analysis.score}%
							</div>
							<p>{analysis.analysis}</p>
						</div>
					)}
					{data.education.length < 1 ? (
						<h2 className="w-full text-foreground-500">No education history</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.education.map((edu, idx) => (
								<div
									className="flex gap-4 flex-col items-center w-full"
									key={`${edu.degree}-${edu.institution}-${edu.startedAt}-${edu.completedAt}-${idx}`}
								>
									<h3 className="w-full text-lg font-medium">
										{edu.institution}
									</h3>
									<h3 className="w-full text-md">{edu.degree}</h3>
									<div className="w-full flex gap-2 text-foreground-500">
										<p className="text-sm">
											{edu.startedAt
												? monthYearFormat.format(new Date(edu.startedAt))
												: "N/A"}
											{" - "}
											{edu.completedAt
												? monthYearFormat.format(new Date(edu.completedAt))
												: "Present"}
										</p>
									</div>
									{idx < data.education.length - 1 && (
										<div className="w-full">
											<hr className="border-foreground-200" />
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
