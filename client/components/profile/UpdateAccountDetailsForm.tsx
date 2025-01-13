import { useFragment, useMutation } from "react-relay";

import { getGravatarURL } from "@/lib/avatars";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Avatar,
	Badge,
	Button,
	Card,
	CardHeader,
	Input,
	Tooltip,
} from "@nextui-org/react";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { graphql } from "relay-runtime";
import { z } from "zod";
import type { UpdateAccountDetailsFormFragment$key } from "./__generated__/UpdateAccountDetailsFormFragment.graphql";

const UpdateAccountDetailsFormMutation = graphql`
mutation UpdateAccountDetailsFormMutation($fullName: String!)  {
	updateAccount(fullName: $fullName) {
		__typename
		... on Account {
			...UpdateAccountDetailsFormFragment
			...AccountDetailsFragment
		}
	}
}`;

const UpdateAccountDetailsFormFragment = graphql`
  fragment UpdateAccountDetailsFormFragment on Account {
    fullName
    email
  }
`;

type Props = {
	rootQuery: UpdateAccountDetailsFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({
	fullName: z.string().min(1, "This field is required").max(75),
});

export default function UpdateAccountDetailsForm({
	rootQuery,
	onSaveChanges,
}: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(
		UpdateAccountDetailsFormMutation,
	);
	const data = useFragment(UpdateAccountDetailsFormFragment, rootQuery);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: data.fullName,
		},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				fullName: formData.fullName,
			},
		});
		onSaveChanges();
	}

	async function handleCancel() {
		onSaveChanges();
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex gap-6 w-full items-center justify-start">
						<Badge
							placement="bottom-right"
							variant="solid"
							content={
								<Tooltip
									content={
										<div className="px-1 py-2 max-w-52 flex flex-col gap-2">
											<div className="text-small">
												Managed by{" "}
												<Link
													href="https://gravatar.com"
													className="text-primary"
													target="_blank"
												>
													Gravatar
												</Link>
											</div>
											<div className="text-tiny">
												Update your image by changing it on your Gravatar
												account!
											</div>
										</div>
									}
								>
									<InfoIcon size={18} />
								</Tooltip>
							}
							size="md"
							shape="circle"
							showOutline={false}
						>
							<Avatar
								name={data.fullName}
								size="lg"
								src={getGravatarURL(data.email)}
							/>
						</Badge>
						<div className="flex flex-col gap-8 w-full items-center justify-start">
							<div className="flex flex-col w-full space-y-4">
								<Controller
									name="fullName"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<Input
											{...field}
											label="Full Name"
											placeholder="Add your full name"
											value={field.value ?? ""}
											errorMessage={errors.fullName?.message}
											isInvalid={!!errors.fullName}
										/>
									)}
								/>
							</div>
							<Input
								label="Email Address"
								placeholder="Add your email"
								value={data.email}
								isDisabled
							/>
						</div>
					</div>
				</CardHeader>
			</Card>

			<div className="mt-4 flex justify-end gap-6">
				<Button
					type="button"
					variant="light"
					onPress={handleCancel}
					isLoading={isMutationInFlight || isSubmitting}
				>
					Cancel
				</Button>
				<Button type="submit" isLoading={isMutationInFlight || isSubmitting}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}
