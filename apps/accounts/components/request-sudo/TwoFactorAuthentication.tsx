"use client";

import type { TwoFactorAuthenticationMutation as TwoFactorAuthenticationMutationType } from "@/__generated__/TwoFactorAuthenticationMutation.graphql";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";
import { useTurnstile } from "../TurnstileProvider";

const TwoFactorAuthenticationMutation = graphql`
  mutation TwoFactorAuthenticationMutation($twoFactorToken: String!, $recaptchaToken: String!) {
    requestSudoModeWithAuthenticator(twoFactorToken: $twoFactorToken, recaptchaToken: $recaptchaToken) {
      __typename
      ... on Account {
        __typename
      }
      ... on InvalidCredentialsError {
        message
      }
      ... on InvalidRecaptchaTokenError {
        message
      }

      ... on AuthenticatorNotEnabledError {
        message
      }
    }
  }
`;

const twoFactorAuthenticationSchema = z.object({
	twoFactorToken: z.string().min(1, "This field is required"),
});

export default function TwoFactorAuthentication({
	isDisabled,
	onAuthStart,
	onAuthEnd,
}: {
	isDisabled: boolean;
	onAuthStart: () => void;
	onAuthEnd: () => void;
}) {
	const params = useSearchParams();
	const redirectTo = getValidSudoModeRedirectURL(params.get("return_to"));

	const [
		committwoFactorTokenLoginMutation,
		istwoFactorTokenLoginMutationInFlight,
	] = useMutation<TwoFactorAuthenticationMutationType>(
		TwoFactorAuthenticationMutation,
	);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof twoFactorAuthenticationSchema>>({
		resolver: zodResolver(twoFactorAuthenticationSchema),
	});

	const { executeRecaptcha } = useTurnstile();

	async function onSubmit(
		values: z.infer<typeof twoFactorAuthenticationSchema>,
	) {
		onAuthStart();
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			onAuthEnd();
			return;
		}
		const token = await executeRecaptcha("login_twoFactorToken");
		committwoFactorTokenLoginMutation({
			variables: {
				twoFactorToken: values.twoFactorToken,
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.requestSudoModeWithAuthenticator.__typename ===
					"InvalidCredentialsError"
				) {
					setError("twoFactorToken", {
						message: response.requestSudoModeWithAuthenticator.message,
					});
					onAuthEnd();
				} else if (
					response.requestSudoModeWithAuthenticator.__typename ===
					"InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
					onAuthEnd();
				} else if (
					response.requestSudoModeWithAuthenticator.__typename ===
					"AuthenticatorNotEnabledError"
				) {
					// race condition: show a toast here
					onAuthEnd();
				} else {
					window.location.href = redirectTo;
				}
			},
			onError(error) {
				onAuthEnd();
			},
			updater(store) {
				store.invalidateStore();
			},
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
				<div className="w-full flex flex-col">
					<Input
						id="twoFactorToken"
						label="Enter Authentication Code"
						placeholder="XXXXXX"
						{...register("twoFactorToken")}
						errorMessage={errors.twoFactorToken?.message}
						isInvalid={!!errors.twoFactorToken}
					/>
				</div>
				<Button
					fullWidth
					isDisabled={isDisabled}
					isLoading={isSubmitting || istwoFactorTokenLoginMutationInFlight}
					type="submit"
					size="lg"
				>
					Verify Code
				</Button>
			</div>
		</form>
	);
}
