import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { EditIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import type { PersonalDetailsFragment$key } from "@/__generated__/PersonalDetailsFragment.graphql";

const PersonalDetailsFragment = graphql`
  fragment PersonalDetailsFragment on Account {
    profile {
      ... on Profile {
        __typename
		address {
			city
			country
			line1
			line2
			pincode
			state
		}
		gender
		dateOfBirth
		maritalStatus
		category
      }
      ... on ProfileNotFoundError {
        __typename
      }
    }
  }
`;

type Props = {
	rootQuery: PersonalDetailsFragment$key;
	onEditProfile: () => void;
};

export default function PersonalDetails({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(PersonalDetailsFragment, rootQuery);

	const profileNotFound = data.profile.__typename !== "Profile";

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
						{profileNotFound || !data.profile.gender ? (
							<h2 className="w-full text-foreground-500">Add your gender</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{data.profile.gender}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Date of Birth</h1>
						{profileNotFound || !data.profile.dateOfBirth ? (
							<h2 className="w-full text-foreground-500">
								Add your date of birth
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{String(data.profile.dateOfBirth)}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Address</h1>
						<div className="flex w-full justify-between gap-2">
							<div className="flex flex-col gap-8 w-full items-center justify-start">
								<div className="flex flex-col gap-2 w-full items-center justify-start">
									<h1 className="w-full text-md font-medium text-foreground-500">
										City
									</h1>
									{profileNotFound || !data.profile.address?.city ? (
										<h2 className="w-full text-foreground-500">
											Add your city
										</h2>
									) : (
										<h2 className="w-full text-foreground-500">
											{data.profile.address?.city}
										</h2>
									)}
								</div>
								<div className="flex flex-col gap-2 w-full items-center justify-start">
									<h1 className="w-full text-md font-medium text-foreground-500">
										Country
									</h1>
									{profileNotFound || !data.profile.address?.country ? (
										<h2 className="w-full text-foreground-500">
											Add your country
										</h2>
									) : (
										<h2 className="w-full text-foreground-500">
											{data.profile.address?.country}
										</h2>
									)}
								</div>
								<div className="flex flex-col gap-2 w-full items-center justify-start">
									<h1 className="w-full text-md font-medium text-foreground-500">
										Pincode
									</h1>
									{profileNotFound || !data.profile.address?.pincode ? (
										<h2 className="w-full text-foreground-500">
											Add your pincode
										</h2>
									) : (
										<h2 className="w-full text-foreground-500">
											{data.profile.address?.pincode}
										</h2>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-8 w-full items-center justify-start">
								<div className="flex flex-col gap-2 w-full items-center justify-start">
									<h1 className="w-full text-md font-medium text-foreground-500">
										Line 1
									</h1>
									{profileNotFound || !data.profile.address?.line1 ? (
										<h2 className="w-full text-foreground-500">Add line 1</h2>
									) : (
										<h2 className="w-full text-foreground-500">
											{data.profile.address?.line1}
										</h2>
									)}
								</div>
								<div className="flex flex-col gap-2 w-full items-center justify-start">
									<h1 className="w-full text-md font-medium text-foreground-500">
										Line 2
									</h1>
									{profileNotFound || !data.profile.address?.line2 ? (
										<h2 className="w-full text-foreground-500">Add line 2</h2>
									) : (
										<h2 className="w-full text-foreground-500">
											{data.profile.address?.line2}
										</h2>
									)}
								</div>
								<div className="flex flex-col gap-2 w-full items-center justify-start">
									<h1 className="w-full text-md font-medium text-foreground-500">
										State
									</h1>
									{profileNotFound || !data.profile.address?.state ? (
										<h2 className="w-full text-foreground-500">
											Add your state
										</h2>
									) : (
										<h2 className="w-full text-foreground-500">
											{data.profile.address?.state}
										</h2>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Marital Status</h1>
						{profileNotFound || !data.profile.maritalStatus ? (
							<h2 className="w-full text-foreground-500">
								Add your marital status
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{data.profile.maritalStatus}
							</h2>
						)}
					</div>
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						<h1 className="w-full text-lg font-medium">Category</h1>
						{profileNotFound || !data.profile.category ? (
							<h2 className="w-full text-foreground-500">Add your category</h2>
						) : (
							<h2 className="w-full text-foreground-500">
								{data.profile.category}
							</h2>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
