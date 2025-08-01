import type { AlreadyVerifiedFragment$key } from "@/__generated__/AlreadyVerifiedFragment.graphql";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { Alert } from "@heroui/react";
import { CalendarIcon, VerifiedIcon } from "lucide-react";
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

	const formatVerificationDate = (dateString: string | null) => {
		if (!dateString) return "Unknown date";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
			<div className="flex flex-col items-center gap-12 max-w-md">
				{/* Verification Status */}
				<div className="flex flex-col items-center gap-8 max-w-md">
					<div className="flex items-center gap-6 w-full">
						<div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center">
							<VerifiedIcon className="w-8 h-8 text-success-600" />
						</div>
						<div className="text-left">
							<div className="flex flex-col gap-4">
								<h1 className="text-2xl font-medium text-gray-900 mb-2">
									Organization Verified
								</h1>
							</div>
							<p className="text-gray-600">
								Your organization has been successfully verified
							</p>
						</div>
					</div>

					{/* Verification Date */}
					<Alert
						variant="flat"
						color="success"
						className="w-full"
						icon={<CalendarIcon className="w-5 h-5" />}
						hideIconWrapper
					>
						<div>
							<p className="text-sm font-medium text-gray-700">Verified on</p>
							<p className="text-sm text-gray-600">
								{formatVerificationDate(data.verifiedAt)}
							</p>
						</div>
					</Alert>

					{/* Credibility Boost */}
					<Alert
						variant="flat"
						color="success"
						className="w-full"
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
						className="w-full"
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
