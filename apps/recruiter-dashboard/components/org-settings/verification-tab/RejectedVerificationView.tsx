import type { RejectedVerificationViewFragment$key } from "@/__generated__/RejectedVerificationViewFragment.graphql";
import { Alert, Button } from "@heroui/react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import RequestVerificationForm from "./RequestVerificationForm";

const RejectedVerificationViewFragment = graphql`
	fragment RejectedVerificationViewFragment on Organization {
		__typename
		id
		name
		verificationStatus {
			__typename
			... on Rejected @alias(as: "rejected") {
				rejectedAt
			}
		}
		...RequestVerificationFormFragment
	}
`;

export default function RejectedVerificationView({
	organization,
}: {
	organization: RejectedVerificationViewFragment$key;
}) {
	const data = useFragment(RejectedVerificationViewFragment, organization);
	const [showVerificationForm, setShowVerificationForm] = useState(false);

	// Format the rejectedAt date
	const formatRejectedDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// If form should be shown, render the RequestVerificationForm
	if (showVerificationForm) {
		return <RequestVerificationForm organization={data} />;
	}

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
			<div className="flex flex-col items-center gap-12 max-w-md">
				{/* Rejected Status */}
				<div className="flex flex-col items-center gap-8 max-w-md">
					<div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
						<div className="text-left">
							<div className="flex flex-col gap-4">
								<h1 className="text-2xl font-medium text-gray-900 mb-2">
									Your request was not approved
								</h1>
							</div>
							{data.verificationStatus.__typename === "Rejected" &&
								data.verificationStatus.rejected && (
									<p className="text-sm text-gray-500 mt-2">
										Rejected on{" "}
										{formatRejectedDate(
											data.verificationStatus.rejected.rejectedAt,
										)}
									</p>
								)}
						</div>
					</div>

					{/* Rejection Reason */}
					<Alert
						variant="flat"
						color="danger"
						className="w-full [&_svg]:fill-none"
						icon={<AlertTriangleIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-gray-700 mb-1">
								Why was it rejected?
							</p>
							<p className="text-sm text-gray-600">
								Common reasons include incomplete documentation, unclear
								organization details, or documents that don't match our
								verification criteria.
							</p>
						</div>
					</Alert>

					{/* Try Again */}
					<Alert
						variant="flat"
						color="primary"
						className="w-full [&_svg]:fill-none"
						icon={<RefreshCwIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-primary-900 mb-1">
								Want to try again?
							</p>
							<p className="text-sm text-primary-700 mb-4">
								You can submit a new verification request with updated
								information and documents.
							</p>
							<Button
								color="primary"
								variant="solid"
								size="sm"
								startContent={<RefreshCwIcon className="w-4 h-4" />}
								onPress={() => {
									setShowVerificationForm(true);
								}}
							>
								Submit New Request
							</Button>
						</div>
					</Alert>
				</div>
			</div>
		</div>
	);
}
