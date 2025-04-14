import type { ApplicantFragment$key } from "@/__generated__/ApplicantFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardHeader, Chip } from "@heroui/react";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const ApplicantFragment = graphql`
  fragment ApplicantFragment on JobApplicant @argumentDefinitions(
	showStatus: { type: "Boolean", defaultValue: true }
  ) {
	slug
	status @include(if: $showStatus)
	account {
		fullName
		avatarUrl
		email
	}
  }
`;

type Props = {
	applicant: ApplicantFragment$key;
};

export default function Applicant({ applicant }: Props) {
	const router = useRouter();
	const params = useParams<{ slug: string; jobSlug: string }>();
	const data = useFragment(ApplicantFragment, applicant);

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer space-y-6"
			as="div"
			disableRipple
			shadow="none"
			isPressable
			onPress={() => {
				router.push(
					links.applicantDetail(
						params.slug,
						params.jobSlug,
						encodeURIComponent(data.slug),
					),
				);
			}}
		>
			<CardHeader className="flex w-full justify-center flex-row gap-6 items-center">
				<div className="flex flex-col sm:flex-row gap-6 w-full items-center">
					<div className="relative w-12 h-12">
						<Image
							src={data.account.avatarUrl}
							alt={data.account.fullName}
							fill
							className="rounded-full"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<h4 className="text-lg text-balance">{data.account.fullName}</h4>
						<div className="w-full flex items-center gap-2 text-foreground-600">
							<Mail size={16} />
							<p className="text-sm text-balance/50">{data.account.email}</p>
						</div>
					</div>
				</div>
				{data.status && (
					<div className="flex items-center gap-4">
						<p className="text-foreground-400 text-sm">Status</p>
						<Chip>{data.status}</Chip>
					</div>
				)}
			</CardHeader>
		</Card>
	);
}
