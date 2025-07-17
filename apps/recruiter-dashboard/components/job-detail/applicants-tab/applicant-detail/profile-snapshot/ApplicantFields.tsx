import type { ApplicantFieldsFragment$key } from "@/__generated__/ApplicantFieldsFragment.graphql";
import { getAnalysisColor } from "@/lib/colors";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Alert, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { ShieldQuestion, SparklesIcon } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const ApplicantFieldsFragment = graphql`
    fragment ApplicantFieldsFragment on JobApplicant {
        applicantFields {
            fieldName
            fieldValue
        }
        analysis {
            __typename
            ... on JobApplicantAnalysis {
                analysedFields {
                    applicantFields {
                        analysis
                        score
                    }
                 }
            }
        }
    }
`;

export default function ApplicantFields({
	rootQuery,
}: { rootQuery: ApplicantFieldsFragment$key }) {
	const data = useFragment(ApplicantFieldsFragment, rootQuery);

	const analysis =
		data.analysis?.__typename === "JobApplicantAnalysis"
			? data.analysis.analysedFields
			: undefined;

	useCopilotReadable({
		description: "The applicant's responses to the job's screening questions",
		value: data.applicantFields,
	});

	if (!data.applicantFields || data.applicantFields.length === 0) return null;

	return (
		<Card fullWidth shadow="none" className="p-6 space-y-6">
			<CardHeader>
				<h3 className="text-sm text-foreground-500">Screening Questions</h3>
			</CardHeader>
			<Divider />
			<CardBody>
				<div className="flex flex-col gap-12">
					{data.applicantFields.map((field, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={index} className="flex flex-col gap-4">
							<div className="w-full flex items-center gap-2">
								<ShieldQuestion className="text-foreground-500" size={20} />
								<h4 className="text-foreground-800 font-medium">
									{field.fieldName}
								</h4>
							</div>
							<p className="text-foreground-600">{field.fieldValue}</p>
						</div>
					))}
				</div>
				{analysis?.applicantFields && (
					<Alert
						icon={<SparklesIcon size={18} />}
						hideIconWrapper
						color={getAnalysisColor(analysis.applicantFields.score)}
						description={analysis.applicantFields.analysis}
						variant="flat"
						radius="md"
					/>
				)}
			</CardBody>
		</Card>
	);
}
