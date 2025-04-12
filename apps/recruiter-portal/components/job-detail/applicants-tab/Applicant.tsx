import type { ApplicantFragment$key } from "@/__generated__/ApplicantFragment.graphql";
import { useRouter } from "@bprogress/next";
import { Card, CardHeader } from "@heroui/react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const ApplicantFragment = graphql`
  fragment ApplicantFragment on JobApplicant {
	account {
		fullName
		avatarUrl
	}
  }
`;

type Props = {
	applicant: ApplicantFragment$key;
};

export default function Applicant({ applicant }: Props) {
	const router = useRouter();
	const data = useFragment(ApplicantFragment, applicant);

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer space-y-6"
			as="div"
			disableRipple
			shadow="none"
		>
			<CardHeader className="flex flex-col sm:flex-row gap-6 w-full items-center">
				<div className="relative w-12 h-12">
					<Image
						src={data.account.avatarUrl}
						alt={data.account.fullName}
						fill
						className="rounded-full"
					/>
				</div>
				<h4 className="text-lg/7 sm:text-xl/8 font-medium text-balance">
					{data.account.fullName}
				</h4>
			</CardHeader>
		</Card>
	);
}
