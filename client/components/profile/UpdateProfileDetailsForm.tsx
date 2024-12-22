import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment } from "react-relay";
import type { UpdateProfileDetailsFormFragment$key } from "./__generated__/UpdateProfileDetailsFormFragment.graphql";

const UpdateProfileDetailsFormFragment = graphql`
  fragment UpdateProfileDetailsFormFragment on Account {
    profile {
      ... on Profile {
        __typename
      }
      ... on ProfileNotFoundError {
        __typename
      }
    }
  }
`;

type Props = {
	rootQuery: UpdateProfileDetailsFormFragment$key;
};

type FormData = {
	gender: string;
	dateOfBirth: string;
	address: string;
	maritalStatus: string;
	category: string;
	languages: string;
	totalExperience: string;
	currentCompanyName: string;
	currentJobTitle: string;
};

export default function UpdateProfileDetailsForm({ rootQuery }: Props) {
	const data = useFragment(UpdateProfileDetailsFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = (formData: FormData) => {
		console.log("Form Data Submitted:", formData);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			{/* Personal Details */}
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader>
					<h1 className="text-lg font-medium">Personal Details</h1>
				</CardHeader>
				<CardBody>
					<div className="mb-8">
						<Controller
							name="gender"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Gender"
									placeholder="Add your gender"
								/>
							)}
						/>
						{errors.gender && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="dateOfBirth"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Date of Birth"
									placeholder="Add your date of birth"
								/>
							)}
						/>
						{errors.dateOfBirth && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="address"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Address"
									placeholder="Add your address"
								/>
							)}
						/>
						{errors.address && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="maritalStatus"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Marital Status"
									placeholder="Add your marital status"
								/>
							)}
						/>
						{errors.maritalStatus && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="category"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Category"
									placeholder="Add your category"
								/>
							)}
						/>
						{errors.category && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="languages"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Languages"
									placeholder="Add your languages"
								/>
							)}
						/>
						{errors.languages && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
				</CardBody>
			</Card>

			{/* Employment Details */}
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader>
					<h1 className="text-lg font-medium">Employment Details</h1>
				</CardHeader>
				<CardBody>
					<div className="mb-8">
						<Controller
							name="totalExperience"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Total Experience"
									placeholder="Add your total experience"
								/>
							)}
						/>
						{errors.totalExperience && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="currentCompanyName"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Current Company Name"
									placeholder="Add your company name"
								/>
							)}
						/>
						{errors.currentCompanyName && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-8">
						<Controller
							name="currentJobTitle"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Current Job Title"
									placeholder="Add your job title"
								/>
							)}
						/>
						{errors.currentJobTitle && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
				</CardBody>
			</Card>

			<div className="mt-4 flex justify-end gap-6">
				<Button type="button" variant="light">
					Cancel
				</Button>
				<Button type="submit">Save Changes</Button>
			</div>
		</form>
	);
}
