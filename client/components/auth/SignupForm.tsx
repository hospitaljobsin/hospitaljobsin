"use client";

import { env } from "@/lib/env";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "@lobehub/icons";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";
import type { SignupFormRegisterMutation as SignupFormRegisterMutationType } from "./__generated__/SignupFormRegisterMutation.graphql";
import type { SignupFormRequestVerificationMutation as SignupFormRequestVerificationMutationType } from "./__generated__/SignupFormRequestVerificationMutation.graphql";

const RequestVerificationMutation = graphql`
  mutation SignupFormRequestVerificationMutation($email: String!) {
    requestEmailVerificationToken(email: $email) {
      __typename
      ... on EmailInUseError {
        message
      }
	  ... on EmailVerificationTokenCooldownError {
		message
	  }
    }
  }
`;

const RegisterMutation = graphql`
  mutation SignupFormRegisterMutation(
    $email: String!
    $emailVerificationToken: String!
    $password: String!
    $fullName: String!
  ) {
    register(
      email: $email
      emailVerificationToken: $emailVerificationToken
      password: $password
      fullName: $fullName
    ) {
      __typename
      ... on EmailInUseError {
        message
      }
	  ... on InvalidEmailVerificationTokenError {
		message
	   }
    }
  }
`;

const step1Schema = z.object({
	email: z.string().email(),
});

const step2Schema = z.object({
	emailVerificationToken: z.string().min(1),
	password: z.string().min(6),
	fullName: z.string().min(1),
});

export default function SignUpForm() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [email, setEmail] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	// Step 1: Request verification code
	const {
		register: registerStep1,
		handleSubmit: handleSubmitStep1,
		setError: setEmailError,
		formState: { errors: errorsStep1, isSubmitting: isSubmittingStep1 },
	} = useForm<z.infer<typeof step1Schema>>({
		resolver: zodResolver(step1Schema),
	});

	const [commitRequestVerification] =
		useMutation<SignupFormRequestVerificationMutationType>(
			RequestVerificationMutation,
		);

	// Step 2: Complete registration
	const {
		register: registerStep2,
		handleSubmit: handleSubmitStep2,
		setError: setRegisterError,
		formState: { errors: errorsStep2, isSubmitting: isSubmittingStep2 },
	} = useForm<z.infer<typeof step2Schema>>({
		resolver: zodResolver(step2Schema),
	});

	const [commitRegister] =
		useMutation<SignupFormRegisterMutationType>(RegisterMutation);

	const handleRequestVerification = async (
		data: z.infer<typeof step1Schema>,
	) => {
		commitRequestVerification({
			variables: { email: data.email },
			onCompleted(response) {
				if (
					response.requestEmailVerificationToken.__typename ===
					"EmailInUseError"
				) {
					setEmailError("email", {
						message: response.requestEmailVerificationToken.message,
					});
				} else {
					setEmail(data.email);
					setCurrentStep(2);
				}
			},
		});
	};

	const handleRegister = async (data: z.infer<typeof step2Schema>) => {
		commitRegister({
			variables: {
				email,
				emailVerificationToken: data.emailVerificationToken,
				password: data.password,
				fullName: data.fullName,
			},
			onCompleted(response) {
				if (response.register.__typename === "EmailInUseError") {
					setRegisterError("root", { message: response.register.message });
				} else if (
					response.register.__typename === "InvalidEmailVerificationTokenError"
				) {
					setRegisterError("emailVerificationToken", {
						message: response.register.message,
					});
				} else {
					router.replace(links.confirmSignup);
				}
			},
		});
	};

	const handleResendVerification = async () => {
		commitRequestVerification({
			variables: { email },
			onCompleted(response) {
				if (
					response.requestEmailVerificationToken.__typename ===
					"EmailVerificationTokenCooldownError"
				) {
					setEmailError("root", {
						message: response.requestEmailVerificationToken.message,
					});
				}
			},
		});
	};

	return (
		<Card className="p-6 space-y-6" shadow="sm">
			<CardHeader>
				<h1 className="text-2xl text-center w-full">Create your account</h1>
			</CardHeader>
			<CardBody>
				{currentStep === 1 ? (
					<form
						onSubmit={handleSubmitStep1(handleRequestVerification)}
						className="space-y-3"
					>
						<div className="w-full flex flex-col gap-6">
							<Input
								label="Email Address"
								placeholder="Enter your email address"
								type="email"
								{...registerStep1("email")}
								errorMessage={errorsStep1.email?.message}
								isInvalid={!!errorsStep1.email}
							/>
							<Button fullWidth type="submit" isLoading={isSubmittingStep1}>
								Next
							</Button>
						</div>
					</form>
				) : (
					<form
						onSubmit={handleSubmitStep2(handleRegister)}
						className="space-y-3"
					>
						<div className="w-full flex flex-col gap-6">
							<Input
								label="Email Address"
								value={email}
								isDisabled
								// errorMessage={errorsStep2.email?.message}
								// isInvalid={!!errorsStep2.email}
							/>
							<div className="w-full flex justify-start">
								<Button
									onPress={() => {
										setCurrentStep(1);
									}}
									variant="light"
								>
									Incorrect email? Go back
								</Button>
							</div>
							<div className="w-full flex justify-start items-center gap-6">
								<Input
									label="Email Verification Code"
									placeholder="XXXX-XXXX"
									{...registerStep2("emailVerificationToken")}
									errorMessage={errorsStep2.emailVerificationToken?.message}
									isInvalid={!!errorsStep2.emailVerificationToken}
								/>
								<Button
									size="md"
									variant="faded"
									onPress={handleResendVerification}
								>
									Resend
								</Button>
							</div>
							<Input
								label="Full Name"
								placeholder="Enter your full name"
								{...registerStep2("fullName")}
								errorMessage={errorsStep2.fullName?.message}
								isInvalid={!!errorsStep2.fullName}
							/>
							<Input
								label="Password"
								placeholder="Enter password"
								type={isPasswordVisible ? "text" : "password"}
								endContent={
									<button
										type="button"
										onClick={() => setIsPasswordVisible(!isPasswordVisible)}
										className="focus:outline-none"
									>
										{isPasswordVisible ? (
											<EyeIcon className="text-2xl text-default-400" />
										) : (
											<EyeOffIcon className="text-2xl text-default-400" />
										)}
									</button>
								}
								{...registerStep2("password")}
								errorMessage={errorsStep2.password?.message}
								isInvalid={!!errorsStep2.password}
							/>
							<Button fullWidth type="submit" isLoading={isSubmittingStep2}>
								Create account
							</Button>
						</div>
					</form>
				)}
			</CardBody>
			<CardFooter className="flex flex-col w-full gap-8">
				<div className="w-full flex items-center justify-center gap-6">
					<Divider className="flex-1" />
					<p>or</p>
					<Divider className="flex-1" />
				</div>
				<Button
					fullWidth
					variant="bordered"
					startContent={<Google.Color size={20} />}
					onPress={() => {
						window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/signin/google?redirect_uri=${encodeURIComponent(window.location.origin)}`;
					}}
				>
					Sign up with Google
				</Button>
				<div className="flex justify-center w-full">
					<Link href={links.login} className="cursor-pointer text-blue-500">
						Already have an account? Log in.
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
