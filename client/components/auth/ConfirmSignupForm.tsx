"use client";

import { handleSignUpStep } from "@/lib/cognitoActions";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@heroui/react";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmSignUpSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	code: z.string().min(6, { message: "Code must be at least 6 characters" }),
});

export default function ConfirmSignUpForm() {
	const router = useRouter();
	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [resendErrorMessage, setResendErrorMessage] = useState<string | null>(
		null,
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid, isSubmitting },
	} = useForm<z.infer<typeof confirmSignUpSchema>>({
		resolver: zodResolver(confirmSignUpSchema),
		mode: "onChange",
	});

	const email = watch("email");
	const code = watch("code");

	async function handleSendEmailVerificationCode({ email }: { email: string }) {
		try {
			await resendSignUpCode({ username: email });
			setResendMessage("Verification code sent successfully");
			setResendErrorMessage(null);
		} catch (error) {
			setResendErrorMessage(getErrorMessage(error));
			setResendMessage(null);
		}
	}

	async function onSubmit(values: z.infer<typeof confirmSignUpSchema>) {
		let nextStep;
		try {
			const { isSignUpComplete, nextStep: step } = await confirmSignUp({
				username: values.email,
				confirmationCode: values.code,
			});
			nextStep = step;
			setErrorMessage(null);
		} catch (error) {
			setErrorMessage(getErrorMessage(error));
			return;
		}

		await handleSignUpStep(nextStep, router);
	}

	return (
		<Card shadow="sm">
			<CardHeader>
				<h1 className="text-center text-2xl w-full">
					Confirm your account email
				</h1>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div className="flex-1 rounded-lg px-6 pb-4 pt-8">
						<div className="w-full flex flex-col gap-6">
							<Input
								id="email"
								label="Email"
								placeholder="Enter your email address"
								type="email"
								{...register("email")}
								errorMessage={errors.email?.message}
								isInvalid={!!errors.email}
							/>
							<Input
								id="code"
								label="Code"
								placeholder="Enter code"
								type="text"
								{...register("code")}
								errorMessage={errors.code?.message}
								isInvalid={!!errors.code}
							/>
							<Button
								fullWidth
								disabled={!isValid}
								isLoading={isSubmitting}
								type="submit"
							>
								Confirm
							</Button>
						</div>

						{errorMessage && (
							<p className="mt-2 text-sm text-red-500">{errorMessage}</p>
						)}
					</div>
				</form>
			</CardBody>
			<Divider />
			<CardFooter>
				<Button
					fullWidth
					disabled={!email || !!errors.email}
					isLoading={false} // TODO: add loading state here as well
					onClick={() => handleSendEmailVerificationCode({ email })}
					type="button"
					variant="light"
				>
					Resend Verification Code
				</Button>
				{resendErrorMessage && (
					<p className="mt-2 text-sm text-red-500">{resendErrorMessage}</p>
				)}
				{resendMessage && (
					<p className="mt-2 text-sm text-green-500">{resendMessage}</p>
				)}
			</CardFooter>
		</Card>
	);
}
