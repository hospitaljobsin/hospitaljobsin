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

	// If form should be shown, render the RequestVerificationForm
	if (showVerificationForm) {
		return <RequestVerificationForm organization={data} />;
	}

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
			<div className="flex flex-col items-center gap-12 max-w-md">
				{/* Rejected Status */}
				<div className="flex flex-col items-center gap-8 max-w-md">
					<div className="flex items-center gap-6 w-full">
						<div className="w-12 h-12 bg-danger-50 rounded-full flex items-center justify-center">
							<AlertTriangleIcon className="w-8 h-8 text-danger-600" />
						</div>
						<div className="text-left">
							<div className="flex flex-col gap-4">
								<h1 className="text-2xl font-medium text-gray-900 mb-2">
									Verification Rejected
								</h1>
							</div>
							<p className="text-gray-600">
								Your verification request was not approved
							</p>
						</div>
					</div>

					{/* Rejection Reason */}
					<Alert
						variant="flat"
						color="danger"
						className="w-full"
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
						className="w-full"
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
