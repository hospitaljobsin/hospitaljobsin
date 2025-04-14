import type { ApplicantDetailsFragment$key } from "@/__generated__/ApplicantDetailsFragment.graphql";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useParams } from "next/navigation";
import { graphql, useFragment } from "react-relay";

const ApplicantDetailsFragment = graphql`
  fragment ApplicantDetailsFragment on JobApplicant {
    account {
        fullName
        avatarUrl
        email
    }
  }
`;

export default function ApplicantDetails({
	rootQuery,
}: { rootQuery: ApplicantDetailsFragment$key }) {
	const params = useParams<{ slug: string; jobSlug: string; id: string }>();
	const data = useFragment(ApplicantDetailsFragment, rootQuery);

	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-6" shadow="none">
				<CardHeader>{data.account.fullName}</CardHeader>
				<CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full"></CardBody>
				<CardFooter className="flex flex-col sm:flex-row justify-between items-end sm:items-center w-full gap-6"></CardFooter>
			</Card>

			{/* Job Description */}
		</div>
	);
}
