import type { AlreadyVerifiedFragment$key } from "@/__generated__/AlreadyVerifiedFragment.graphql";
import { VerifiedIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const AlreadyVerifiedFragment = graphql`
	fragment AlreadyVerifiedFragment on Organization {
		__typename
        verifiedAt
	}
`;

export default function AlreadyVerified({
	organization,
}: { organization: AlreadyVerifiedFragment$key }) {
	const data = useFragment(AlreadyVerifiedFragment, organization);
	// want to remove verification badge? contact our support email
	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<div className="flex flex-col items-center gap-2">
				<VerifiedIcon className="w-10 h-10 text-success-500" />
				<h1 className="text-2xl font-medium">Organization Verified</h1>
			</div>
		</div>
	);
}
