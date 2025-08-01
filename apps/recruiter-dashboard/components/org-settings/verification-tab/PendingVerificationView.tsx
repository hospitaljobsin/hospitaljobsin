import type { PendingVerificationViewFragment$key } from "@/__generated__/PendingVerificationViewFragment.graphql";
import { Alert } from "@heroui/react";
import { ClockIcon, InfoIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const PendingVerificationViewFragment = graphql`
	fragment PendingVerificationViewFragment on Organization {
		__typename
		name
	}
`;

export default function PendingVerificationView({
	organization,
}: {
	organization: PendingVerificationViewFragment$key;
}) {
	const data = useFragment(PendingVerificationViewFragment, organization);

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
			<div className="flex flex-col items-center gap-12 max-w-md">
				{/* Pending Status */}
				<div className="flex flex-col items-center gap-8 max-w-md">
					<div className="flex items-center gap-6 w-full">
						<div className="w-12 h-12 bg-warning-50 rounded-full flex items-center justify-center">
							<ClockIcon className="w-8 h-8 text-warning-600" />
						</div>
						<div className="text-left">
							<div className="flex flex-col gap-4">
								<h1 className="text-2xl font-medium text-gray-900 mb-2">
									Verification in Progress
								</h1>
							</div>
							<p className="text-gray-600">
								Your verification request is currently being reviewed
							</p>
						</div>
					</div>

					{/* Processing Time */}
					<Alert
						variant="flat"
						color="warning"
						className="w-full"
						icon={<ClockIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-gray-700">
								Processing Time
							</p>
							<p className="text-sm text-gray-600">
								Verification typically takes 2-3 business days. We'll notify you
								once the review is complete.
							</p>
						</div>
					</Alert>

					{/* What Happens Next */}
					<Alert
						variant="flat"
						color="primary"
						className="w-full"
						icon={<InfoIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-primary-900 mb-1">
								What happens next?
							</p>
							<p className="text-sm text-primary-700">
								Our team will review your submitted documents and verify your
								organization's legitimacy. You'll receive an email notification
								with the result.
							</p>
						</div>
					</Alert>

					{/* Organization Name */}
					<Alert
						variant="flat"
						color="default"
						className="w-full"
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-gray-700 mb-1">
								Organization
							</p>
							<p className="text-sm text-gray-600">{data.name}</p>
						</div>
					</Alert>
				</div>
			</div>
		</div>
	);
}
