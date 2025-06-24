import type { PersonalDetailsFragment$key } from "@/__generated__/PersonalDetailsFragment.graphql";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { UserIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const PersonalDetailsFragment = graphql`
  fragment PersonalDetailsFragment on ProfileSnapshot {
		gender
		dateOfBirth
		maritalStatus
		category
      }
`;

function calculateAge(dateOfBirth: string | Date): string {
	const dob = new Date(dateOfBirth);
	const today = new Date();
	let age = today.getFullYear() - dob.getFullYear();
	const m = today.getMonth() - dob.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
		age--;
	}
	return `${age} yrs (${dob.toLocaleDateString("en-CA")})`;
}

type Props = {
	rootQuery: PersonalDetailsFragment$key;
};

export default function PersonalDetails({ rootQuery }: Props) {
	const data = useFragment(PersonalDetailsFragment, rootQuery);

	useCopilotReadable({
		description: "The current applicant's personal details",
		value: data,
	});

	return (
		<div className="w-full">
			<Card className="w-full p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<UserIcon />
						<h1 className="w-full text-sm font-medium">Personal Details</h1>
					</div>
				</CardHeader>
				<CardBody className="grid grid-cols-1 gap-10 md:grid-cols-2">
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Gender</h1>
						{!data.gender ? (
							<h2 className="w-full text-foreground-500">No gender provided</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.gender}</h2>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Age</h1>
						{!data.dateOfBirth ? (
							<h2 className="w-full text-foreground-500">
								No date of birth provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{calculateAge(data.dateOfBirth as string)}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Marital Status</h1>
						{!data.maritalStatus ? (
							<h2 className="w-full text-foreground-500">
								No marital status provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{data.maritalStatus}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="w-full text-lg font-medium">Category</h1>
						{!data.category ? (
							<h2 className="w-full text-foreground-500">
								No category provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.category}</h2>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
