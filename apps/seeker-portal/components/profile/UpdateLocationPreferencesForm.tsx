import type { UpdateLocationPreferencesFormFragment$key } from "@/__generated__/UpdateLocationPreferencesFormFragment.graphql";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Switch,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import LocationAutocomplete from "../forms/LocationAutocomplete";

const UpdateLocationPreferencesFormFragment = graphql`
  fragment UpdateLocationPreferencesFormFragment on Profile {
        locationsOpenToWork
    	openToRelocationAnywhere
  }
`;

const UpdateLocationPreferencesMutation = graphql`
  mutation UpdateLocationPreferencesFormMutation($locationsOpenToWork: [String!]!, $openToRelocationAnywhere: Boolean!) {
    updateProfileLocationPreferences(locationsOpenToWork: $locationsOpenToWork, openToRelocationAnywhere: $openToRelocationAnywhere) {
	  ... on Account {
		profile {
			... on Profile {
				...UpdateLocationPreferencesFormFragment
				...LocationPreferencesFragment
			}
		}

	  }
    }
  }
`;

const formSchema = z.object({
	openToRelocationAnywhere: z.boolean(),
	locationsOpenToWork: z.array(z.string()),
});

export default function UpdateLocationPreferencesForm({
	rootQuery,
	onSaveChanges,
}: {
	rootQuery: UpdateLocationPreferencesFormFragment$key;
	onSaveChanges: () => void;
}) {
	const data = useFragment(UpdateLocationPreferencesFormFragment, rootQuery);
	const [commit, isInFlight] = useMutation(UpdateLocationPreferencesMutation);
	const [inputValue, setInputValue] = useState("");

	const defaultValues = {
		openToRelocationAnywhere: data.openToRelocationAnywhere || false,
		locationsOpenToWork: (data.locationsOpenToWork || []) as string[],
	};

	const {
		handleSubmit,
		control,
		setValue,
		setError,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues,
	});

	const locations = useWatch({ control, name: "locationsOpenToWork" }) || [];

	function onSubmit(formData: z.infer<typeof formSchema>) {
		if (
			!formData.openToRelocationAnywhere &&
			(!formData.locationsOpenToWork ||
				formData.locationsOpenToWork.length === 0)
		) {
			setError("locationsOpenToWork", {
				type: "manual",
				message:
					"Please add at least one location or enable open to relocation anywhere.",
			});
			return;
		}
		commit({
			variables: {
				locationsOpenToWork: formData.locationsOpenToWork || [],
				openToRelocationAnywhere: formData.openToRelocationAnywhere,
			},
			onCompleted(response, errors) {
				onSaveChanges();
			},
		});
	}

	function handleRemoveLocation(loc: string) {
		setValue(
			"locationsOpenToWork",
			locations.filter((l: string) => l !== loc) as string[],
		);
	}

	function handleCancel() {
		onSaveChanges();
	}

	return (
		<form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<h1 className="text-lg font-medium">Editing Location Preferences</h1>
				</CardHeader>
				<CardBody className="w-full flex flex-col gap-8">
					<div className="flex items-center gap-4">
						<Controller
							name="openToRelocationAnywhere"
							control={control}
							render={({ field }) => (
								<Switch
									isSelected={field.value}
									onValueChange={(e) => field.onChange(e)}
								/>
							)}
						/>
						<span>Open to relocation anywhere</span>
					</div>
					<div className="mt-4  flex flex-col w-full gap-4">
						<div className="block mb-2">Preferred work locations</div>
						<div className="flex flex-wrap gap-2 mb-2">
							{locations?.map((loc: string) => (
								<Chip
									key={loc}
									isCloseable
									size="lg"
									onClose={() => handleRemoveLocation(loc)}
								>
									{loc}
								</Chip>
							))}
						</div>
						<LocationAutocomplete
							value={inputValue}
							onValueChange={setInputValue}
							onChange={(location) => {
								if (!locations.includes(location.displayName)) {
									setValue(
										"locationsOpenToWork",
										[...locations, location.displayName] as string[],
										{ shouldValidate: true, shouldDirty: true },
									);
								}
								setInputValue("");
							}}
							placeholder="Add a location"
						/>
					</div>
					{errors.locationsOpenToWork && (
						<div className="text-red-500 text-sm">
							{errors.locationsOpenToWork.message}
						</div>
					)}
				</CardBody>
			</Card>
			<div className="mt-4 flex justify-end gap-6">
				<Button
					type="button"
					variant="light"
					onPress={handleCancel}
					isLoading={isSubmitting || isInFlight}
				>
					Cancel
				</Button>
				<Button type="submit" isLoading={isSubmitting || isInFlight}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}
