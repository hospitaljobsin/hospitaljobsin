import type { PrivacySettingsFragment$key } from "@/__generated__/PrivacySettingsFragment.graphql";
import type { PrivacySettingsUpdateAccountAnalyticsPreferenceMutation } from "@/__generated__/PrivacySettingsUpdateAccountAnalyticsPreferenceMutation.graphql";
import { addToast, Button, Divider, Switch } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";

const PrivacySettingsFragment = graphql`
  fragment PrivacySettingsFragment on Account {
    analyticsPreference {
        type
    }
  }
`;

const UpdateAccountAnalyticsPreferenceMutation = graphql`
    mutation PrivacySettingsUpdateAccountAnalyticsPreferenceMutation($analyticsPreference: AnalyticsPreferenceInputType!) {
        updateAccountAnalyticsPreference(analyticsPreference: $analyticsPreference) {
        __typename
        ... on Account {
            id
            analyticsPreference {
                type
            }
                    ...PrivacySettingsFragment
                }
        }
    }
`;

interface CookieSettings {
	necessary: boolean;
	analytics: boolean;
}

export default function PrivacySettings({
	root,
}: { root: PrivacySettingsFragment$key }) {
	const data = useFragment<PrivacySettingsFragment$key>(
		PrivacySettingsFragment,
		root,
	);

	const [commitMutation, isMutationInFlight] =
		useMutation<PrivacySettingsUpdateAccountAnalyticsPreferenceMutation>(
			UpdateAccountAnalyticsPreferenceMutation,
		);

	const {
		control,
		handleSubmit,
		formState: { isDirty },
		reset,
	} = useForm<CookieSettings>({
		defaultValues: {
			necessary: true, // Always enabled
			analytics: data.analyticsPreference.type === "ACCEPTANCE",
		},
	});

	console.log("isDirty: ", isDirty);

	const onSubmit = async (formData: CookieSettings) => {
		commitMutation({
			variables: {
				analyticsPreference: formData.analytics ? "ACCEPTANCE" : "REJECTION",
			},
			onCompleted: (data, errors) => {
				if (data.updateAccountAnalyticsPreference.__typename === "Account") {
					addToast({
						title: "Analytics preferences updated",
						description: "Your analytics preferences have been updated",
						color: "success",
					});
					reset({
						necessary: true,
						analytics:
							data.updateAccountAnalyticsPreference.analyticsPreference.type ===
							"ACCEPTANCE",
					});
				}
			},
			onError: (error) => {
				addToast({
					title: "Failed to update analytics preferences",
					description: error.message,
					color: "danger",
				});
			},
		});
	};

	return (
		<div className="space-y-12">
			<div className="flex flex-col gap-4">
				<h3 className="text-lg">Cookie Settings</h3>
				<p className="text-foreground-500">
					We use cookies to enhance your experience on our platform.
					<br /> You can customize your preferences below.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
				<div className="space-y-12">
					{/* Necessary Cookies */}
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-2">
							<h4 className="font-medium">Necessary Cookies</h4>
							<p className="text-foreground-500 mt-1">
								Essential for the site to work. These cannot be disabled.
							</p>
						</div>
						<Controller
							name="necessary"
							control={control}
							render={({ field }) => (
								<Switch isSelected={field.value} isDisabled className="ml-4" />
							)}
						/>
					</div>

					<Divider />

					{/* Analytics Cookies */}
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-2">
							<h4 className="font-medium">Analytics Cookies</h4>
							<p className="text-foreground-500 mt-1">
								Help us understand how visitors interact with our website by
								collecting and reporting information. This data is used to
								improve our website and services.
							</p>
						</div>
						<Controller
							name="analytics"
							control={control}
							render={({ field }) => (
								<Switch
									isSelected={field.value}
									onValueChange={field.onChange}
									className="ml-4"
								/>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						color="primary"
						isLoading={isMutationInFlight}
						isDisabled={!isDirty}
					>
						Save Preferences
					</Button>
				</div>
			</form>
		</div>
	);
}
