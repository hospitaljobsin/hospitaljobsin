import type { AlreadyVerifiedFragment$key } from "@/__generated__/AlreadyVerifiedFragment.graphql";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { Alert } from "@heroui/react";
import { InfoIcon, PartyPopperIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const AlreadyVerifiedFragment = graphql`
	fragment AlreadyVerifiedFragment on Organization {
		__typename
        verificationStatus {
		__typename
		... on Verified @alias(as: "verified") {
			verifiedAt
		}
		... on Rejected {
			rejectedAt
		}
		... on Pending {
			requestedAt
		}
		... on NotRequested {
			message
		}
	}
	}
`;

export default function AlreadyVerified({
	organization,
}: { organization: AlreadyVerifiedFragment$key }) {
	const data = useFragment(AlreadyVerifiedFragment, organization);

	if (!data.verificationStatus.verified) return null;

	const formatVerificationDate = (dateString: string | null) => {
		if (!dateString) return "Unknown date";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
			<div className="flex flex-col items-center gap-12 max-w-md">
				{/* Verification Status */}
				<div className="flex flex-col items-center gap-8 max-w-md">
					<div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
						<div className="text-left">
							<div className="flex flex-col gap-4">
								<h1 className="text-2xl font-medium text-gray-900 mb-2">
									Organization Verified
								</h1>
							</div>
							<p className="text-gray-600">
								Your organization has been successfully verified
							</p>
							{data.verificationStatus.verified && (
								<p className="text-sm text-gray-500 mt-2">
									Verified on{" "}
									{formatVerificationDate(
										data.verificationStatus.verified.verifiedAt,
									)}
								</p>
							)}
						</div>
					</div>

					{/* Credibility Boost */}
					<Alert
						variant="flat"
						color="success"
						className="w-full [&_svg]:fill-none"
						icon={<PartyPopperIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-success-900 mb-1">
								Verification Badge Benefits
							</p>
							<p className="text-sm text-success-700">
								Your verification badge boosts credibility and trust with job
								seekers, helping you attract top healthcare talent to your
								organization.
							</p>
						</div>
					</Alert>

					{/* Support Contact */}
					<Alert
						variant="flat"
						color="warning"
						className="w-full [&_svg]:fill-none"
						icon={<InfoIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-warning-900 mb-1">
								Need to remove verification badge?
							</p>
							<p className="text-sm text-warning-700">
								Contact{" "}
								<a
									href={`mailto:${SUPPORT_EMAIL}`}
									className="font-medium underline hover:text-warning-800"
								>
									{SUPPORT_EMAIL}
								</a>{" "}
								for assistance
							</p>
						</div>
					</Alert>
				</div>
			</div>
		</div>
	);
}
