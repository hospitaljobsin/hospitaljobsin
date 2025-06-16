import type { PersonalDetailsFragment$key } from "@/__generated__/PersonalDetailsFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { EditIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const PersonalDetailsFragment = graphql`
  fragment PersonalDetailsFragment on Profile {
		gender
		dateOfBirth
		maritalStatus
		category
      }
`;

type Props = {
	rootQuery: PersonalDetailsFragment$key;
	onEditProfile: () => void;
};

export default function PersonalDetails({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(PersonalDetailsFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<h1 className="w-full text-lg font-medium">Personal Details</h1>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="light"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Gender</h1>
						{!data.gender ? (
							<h2 className="w-full text-foreground-500">Add your gender</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.gender}</h2>
						)}
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Date of Birth</h1>
						{!data.dateOfBirth ? (
							<h2 className="w-full text-foreground-500">
								Add your date of birth
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{String(data.dateOfBirth)}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Marital Status</h1>
						{!data.maritalStatus ? (
							<h2 className="w-full text-foreground-500">
								Add your marital status
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{data.maritalStatus}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Category</h1>
						{!data.category ? (
							<h2 className="w-full text-foreground-500">Add your category</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.category}</h2>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
