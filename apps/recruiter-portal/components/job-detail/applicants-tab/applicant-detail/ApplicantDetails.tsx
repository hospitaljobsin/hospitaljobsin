import type { ApplicantDetailsFragment$key } from "@/__generated__/ApplicantDetailsFragment.graphql";
import { Avatar, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { CheckCircle, Clock, Mail, MapIcon, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { graphql, useFragment } from "react-relay";

const ApplicantDetailsFragment = graphql`
  fragment ApplicantDetailsFragment on JobApplicant {
	status
	applicantFields {
			fieldName
			fieldValue
		}
    account @required(action: THROW) {
        fullName
        avatarUrl
        email

		profile {
			__typename
			... on Profile {
				address {
					city
					state
				}
			}

			... on ProfileNotFoundError {
				__typename
			}
		}
    }
  }
`;

export default function ApplicantDetails({
	rootQuery,
}: { rootQuery: ApplicantDetailsFragment$key }) {
	const params = useParams<{ slug: string; jobSlug: string; id: string }>();
	const data = useFragment(ApplicantDetailsFragment, rootQuery);

	// Helper function to get status badge style
	const getStatusChip = (status: string) => {
		switch (status.toLowerCase()) {
			case "accepted":
				return (
					<Chip color="success">
						<CheckCircle />
						{status}
					</Chip>
				);
			case "rejected":
				return (
					<Chip color="danger">
						<XCircle />
						{status}
					</Chip>
				);
			case "pending":
				return (
					<Chip color="warning">
						<Clock />
						{status}
					</Chip>
				);
			default:
				return <Chip>{status}</Chip>;
		}
	};

	// Get location string if available
	const location =
		data.account.profile?.__typename === "Profile" &&
		data.account.profile.address
			? `${data.account.profile.address.city}, ${data.account.profile.address.state}`
			: "Location not provided";

	return (
		<div className="w-full flex flex-col gap-6">
			{/* Applicant Header Card */}
			<Card fullWidth className="p-6 overflow-hidden" shadow="sm">
				<div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
					<Avatar
						size="lg"
						src={data.account.avatarUrl || undefined}
						name={data.account.fullName}
						className="border-4 border-primary-100"
					/>

					<div className="flex flex-col gap-2 flex-grow">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
							<CardHeader as="h2" className="text-2xl font-bold m-0 p-0">
								{data.account.fullName}
							</CardHeader>

							{data.status && <div>{getStatusChip(data.status)}</div>}
						</div>

						<div className="flex flex-col gap-2 text-gray-600">
							<div className="flex items-center gap-2">
								<Mail size={16} />
								<span>{data.account.email}</span>
							</div>

							<div className="flex items-center gap-2">
								<MapIcon size={16} />
								<span>{location}</span>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* Application Fields */}
			{data.applicantFields && data.applicantFields.length > 0 && (
				<Card fullWidth shadow="sm">
					<CardHeader className="border-b">
						<h3 className="text-xl font-semibold">Application Details</h3>
					</CardHeader>
					<CardBody className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{data.applicantFields.map((field, index) => (
								<div key={index} className="flex flex-col gap-1">
									<h4 className="text-sm text-gray-500 font-medium">
										{field.fieldName}
									</h4>
									<p className="text-gray-900">{field.fieldValue || "-"}</p>
								</div>
							))}
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
