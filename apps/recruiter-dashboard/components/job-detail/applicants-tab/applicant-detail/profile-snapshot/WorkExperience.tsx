import type { WorkExperienceFragment$key } from "@/__generated__/WorkExperienceFragment.graphql";
import { monthYearFormat } from "@/lib/intl";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { differenceInMonths, parseISO } from "date-fns";
import {
	BriefcaseIcon,
	ClockIcon,
	PickaxeIcon,
	SparklesIcon,
	StarIcon,
} from "lucide-react";
import { graphql, useFragment } from "react-relay";

const WorkExperienceFragment = graphql`
  fragment WorkExperienceFragment on JobApplicant {
	profileSnapshot {
    __typename
    workExperience {
      title
      organization
      startedAt
      completedAt
      employmentType
	  skills
    }
  }
  analysis {
    __typename
    ... on JobApplicantAnalysis {
      analysedFields {
        workExperience { analysis score }
      }
    }
  }
}
`;

type Props = {
	rootQuery: WorkExperienceFragment$key;
};

// Map employmentType enum to human-readable text
function employmentTypeLabel(type: string | null | undefined) {
	switch (type) {
		case "FULL_TIME":
			return "Full Time";
		case "PART_TIME":
			return "Part Time";
		case "CONTRACT":
			return "Contract";
		case "INTERNSHIP":
			return "Internship";
		case "TEMPORARY":
			return "Temporary";
		case "VOLUNTEER":
			return "Volunteer";
		case "OTHER":
			return "Other";
		default:
			return null;
	}
}

export default function WorkExperience({ rootQuery }: Props) {
	const query = useFragment(WorkExperienceFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis =
		query.analysis?.__typename === "JobApplicantAnalysis"
			? query.analysis.analysedFields?.workExperience
			: undefined;

	useCopilotReadable({
		description: "The current applicant's work experiences",
		value: data.workExperience,
	});

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<BriefcaseIcon />
						<h1 className="w-full text-sm font-medium">Work Experience</h1>
						{analysis && (
							<span className="text-primary-600 text-sm flex items-center gap-2">
								<StarIcon size={16} />
								{Math.round(analysis.score * 100)}%
							</span>
						)}
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.workExperience.length < 1 ? (
						<h2 className="w-full text-foreground-500">
							Add your work experience
						</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.workExperience.map((exp, idx) => (
								<div
									className="flex flex-col gap-12 w-full"
									key={`${exp.title}-${exp.organization}-${exp.startedAt}-${exp.completedAt}-${idx}`}
								>
									<div className="flex gap-4 flex-col items-center w-full">
										<h3 className="w-full text-lg font-medium">{exp.title}</h3>
										<div className="w-full flex gap-4 text-foreground-500 items-center">
											<p>{exp.organization}</p>
											{exp.employmentType && (
												<div className="text-sm flex gap-2 text-foreground-500 items-center">
													<ClockIcon size={14} />
													<p>{employmentTypeLabel(exp.employmentType)}</p>
												</div>
											)}
										</div>

										<div className="w-full flex gap-2 text-foreground-500">
											<p className="text-sm">
												{exp.startedAt
													? monthYearFormat.format(new Date(exp.startedAt))
													: "N/A"}
												{" - "}
												{exp.completedAt
													? monthYearFormat.format(new Date(exp.completedAt))
													: "Present"}
												{(() => {
													if (!exp.startedAt) return null;
													const start = parseISO(exp.startedAt);
													const end = exp.completedAt
														? parseISO(exp.completedAt)
														: new Date();
													const months = differenceInMonths(end, start);
													if (months < 0) return null;
													return ` (${months} month${months !== 1 ? "s" : ""})`;
												})()}
											</p>
										</div>
										{exp.skills && exp.skills.length > 0 && (
											<div className="flex items-center gap-4 w-full">
												<PickaxeIcon
													size={20}
													className="text-foreground-500"
												/>
												<div className="w-full flex flex-col gap-2 text-foreground-500">
													<p className="font-medium">{exp.skills.join(", ")}</p>
												</div>
											</div>
										)}
									</div>
									{idx < data.workExperience.length - 1 && (
										<div className="w-full">
											<hr className="border-foreground-200" />
										</div>
									)}
								</div>
							))}
						</div>
					)}
					{analysis && (
						<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
							<div className="flex items-center gap-4 text-medium">
								<SparklesIcon size={18} /> {analysis.score}%
							</div>
							<p>{analysis.analysis}</p>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
