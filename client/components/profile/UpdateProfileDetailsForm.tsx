import type { DateValue } from "@nextui-org/react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	DatePicker,
	Input,
} from "@nextui-org/react";
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
	onSaveChanges: () => void;
};

type FormData = {
	gender: string;
	dateOfBirth: DateValue;
	address: {
		city: string;
		country: string;
		line1: string | null;
		line2: string | null;
		pincode: string | null;
		state: string;
	};
	maritalStatus: string;
	category: string;
	languages: string;
	totalExperience: string;
	currentCompanyName: string;
	currentJobTitle: string;
};

// TODO: use react-hook-form here

export default function UpdateProfileDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const data = useFragment(UpdateProfileDetailsFormFragment, rootQuery);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>();

	async function onSubmit(formData: FormData) {
		console.log("Form Data Submitted:", formData);
		onSaveChanges();
	}

	async function handleCancel() {
		onSaveChanges();
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			{/* Personal Details */}
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader>
					<h1 className="text-lg font-medium">Editing Personal Details</h1>
				</CardHeader>
				<CardBody>
					<div className="mb-10">
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
					<div className="mb-10">
						<Controller
							name="dateOfBirth"
							control={control}
							render={({ field }) => (
								<DatePicker
									fullWidth
									className="max-w-[284px]"
									label="Date of Birth"
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						{errors.dateOfBirth && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
						<Controller
							name="address.city"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input {...field} label="City" placeholder="Add your city" />
							)}
						/>
						{errors.address?.city && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
						<Controller
							name="address.country"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Country"
									placeholder="Add your country"
								/>
							)}
						/>
						{errors.address?.country && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
						<Controller
							name="address.line1"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input {...field} label="Line 1" placeholder="Add line 1" />
							)}
						/>
						{errors.address?.line1 && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
						<Controller
							name="address.line2"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input {...field} label="Line 2" placeholder="Add line 2" />
							)}
						/>
						{errors.address?.line2 && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
						<Controller
							name="address.pincode"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input
									{...field}
									label="Pincode"
									placeholder="Add your pincode"
								/>
							)}
						/>
						{errors.address?.pincode && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
						<Controller
							name="address.state"
							control={control}
							defaultValue=""
							render={({ field }) => (
								<Input {...field} label="State" placeholder="Add your state" />
							)}
						/>
						{errors.address?.state && (
							<p className="text-red-500">This field is required</p>
						)}
					</div>
					<div className="mb-10">
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
					<div className="mb-10">
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
					<div className="mb-10">
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
					<h1 className="text-lg font-medium">Editing Employment Details</h1>
				</CardHeader>
				<CardBody>
					<div className="mb-10">
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
					<div className="mb-10">
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
					<div className="mb-10">
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
				<Button type="button" variant="light" onPress={handleCancel}>
					Cancel
				</Button>
				<Button type="submit">Save Changes</Button>
			</div>
		</form>
	);
}
