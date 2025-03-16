"use client";

import type { TwoFactorRecoveryCodeFormMutation as TwoFactorRecoveryCodeFormMutationType } from "@/__generated__/TwoFactorRecoveryCodeFormMutation.graphql";
import links from "@/lib/links";
import { getValidRedirectURL } from "@/lib/redirects";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
	Link,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";

const TwoFactorRecoveryCodeFormMutation = graphql`
  mutation TwoFactorRecoveryCodeFormMutation($token: String!, $recaptchaToken: String!) {
	verify2faWithRecoveryCode(token: $token, recaptchaToken: $recaptchaToken) {
	  __typename
      ... on TwoFactorAuthenticationChallengeNotFoundError {
        message
      }
      ... on InvalidRecaptchaTokenError {
        message
      }

      ... on TwoFactorAuthenticationNotEnabledError {
        message
      }

      ... on InvalidCredentialsError {
        message
      }

	}
  }
`;

const twoFactorRecoveryCodeForm = z.object({
	token: z.string().min(1, "This field is required"),
});

export default function TwoFactorRecoveryCodeForm() {
	const router = useRouter();
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));
	const [commitMutation, isMutationInFlight] =
		useMutation<TwoFactorRecoveryCodeFormMutationType>(
			TwoFactorRecoveryCodeFormMutation,
		);
	const {
		handleSubmit,
		setError,
		register,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof twoFactorRecoveryCodeForm>>({
		resolver: zodResolver(twoFactorRecoveryCodeForm),
	});

	const { executeRecaptcha } = useGoogleReCaptcha();

	async function onSubmit(values: z.infer<typeof twoFactorRecoveryCodeForm>) {
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const recaptchaToken = await executeRecaptcha("2fa_challenge_verification");
		commitMutation({
			variables: {
				token: values.token,
				recaptchaToken: recaptchaToken,
			},
			onCompleted(response) {
				if (
					response.verify2faWithRecoveryCode.__typename ===
					"InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.verify2faWithRecoveryCode.__typename ===
					"InvalidCredentialsError"
				) {
					setError("token", {
						message: response.verify2faWithRecoveryCode.message,
					});
				} else if (
					response.verify2faWithRecoveryCode.__typename ===
					"TwoFactorAuthenticationChallengeNotFoundError"
				) {
					// redirect to login page when 2fa challenge expires/ is invalid
					router.replace(links.login(params.get("return_to")));
				} else {
					window.location.href = redirectTo;
				}
			},
		});
	}

	return (
		<Card className="p-6 space-y-8" shadow="none">
			<CardHeader className="w-full flex flex-col gap-4">
				<h1 className="text-center text-2xl w-full">Two Factor Recovery</h1>
				<p className="text-foreground-400 w-full text-center">
					If you are unable to access your authenticator, enter one of your
					recovery codes to verify your identity.
				</p>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div className="w-full flex flex-col gap-6 items-center">
						<Input
							{...register("token")}
							label="Recovery Code"
							errorMessage={errors.token?.message}
							isInvalid={!!errors.token}
							placeholder="XXXX-XXXX"
						/>
						<Button
							fullWidth
							isLoading={isSubmitting || isMutationInFlight}
							type="submit"
						>
							Verify Code
						</Button>
					</div>
				</form>
			</CardBody>
			<Divider />
			<CardFooter className="w-full flex flex-col gap-4 items-center justify-center text-foreground-400 text-center text-small">
				<Link
					href={links.twoFactorAuthentication(params.get("return_to"))}
					className="cursor-pointer text-blue-500 text-small sm:text-sm text-center"
				>
					Use your authenticator app instead
				</Link>
				<Button
					as={Link}
					href={links.login(params.get("return_to"))}
					variant="light"
				>
					Try another sign in method
				</Button>
			</CardFooter>
		</Card>
	);
}
