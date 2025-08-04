"use client";

import type { TwoFactorRecoveryCodeFormMutation as TwoFactorRecoveryCodeFormMutationType } from "@/__generated__/TwoFactorRecoveryCodeFormMutation.graphql";
import { useTurnstile } from "@/components/TurnstileProvider";
import links from "@/lib/links";
import { getValidRedirectURL } from "@/lib/redirects";
import { useRouter } from "@bprogress/next";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";

const TwoFactorRecoveryCodeFormMutation = graphql`
  mutation TwoFactorRecoveryCodeFormMutation($token: String!, $captchaToken: String!) {
	verify2faWithRecoveryCode(token: $token, captchaToken: $captchaToken) {
	  __typename
      ... on TwoFactorAuthenticationChallengeNotFoundError {
        message
      }
      ... on InvalidCaptchaTokenError {
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
	token: z.string().check(z.minLength(1, "This field is required")),
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
		resolver: standardSchemaResolver(twoFactorRecoveryCodeForm),
	});

	const { executeCaptcha } = useTurnstile();

	async function onSubmit(values: z.infer<typeof twoFactorRecoveryCodeForm>) {
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const captchaToken = await executeCaptcha("2fa_challenge_verification");
		commitMutation({
			variables: {
				token: values.token,
				captchaToken: captchaToken,
			},
			onCompleted(response) {
				if (
					response.verify2faWithRecoveryCode.__typename ===
					"InvalidCaptchaTokenError"
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
					className="cursor-pointer text-primary-600 text-small sm:text-sm text-center"
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
