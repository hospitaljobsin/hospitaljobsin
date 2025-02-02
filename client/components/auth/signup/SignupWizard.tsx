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
} from "@heroui/react";
import { Google } from "@lobehub/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import Step1EmailForm from "./Step1EmailForm";
import Step2VerificationForm from "./Step2VerificationForm";
import Step3RegistrationForm from "./Step3RegistrationForm";

// TODO: use a state machine like little-state-machine here
// that way, we can call actions in any step and preserve the form state across navigations
export default function SignUpWizard() {
	const [currentStep, setCurrentStep] = useState(1);
	const [email, setEmail] = useState("");
	const [emailVerificationToken, setEmailVerificationToken] = useState("");
	const [cooldownSeconds, setCooldownSeconds] = useState(0);

	useEffect(() => {
		if (cooldownSeconds <= 0) return;

		const timer = setInterval(() => {
			setCooldownSeconds((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [cooldownSeconds]);

	return (
		<Card className="p-6 space-y-6" classNames={{ base: "w-xl" }}>
			<CardHeader>
				<h1 className="text-2xl text-center w-full">Create your account</h1>
			</CardHeader>
			<CardBody className="space-y-6">
				{currentStep === 1 && (
					<Step1EmailForm
						onSuccess={(email, cooldown) => {
							setEmail(email);
							setCooldownSeconds(cooldown);
							setCurrentStep(2);
						}}
					/>
				)}
				{currentStep === 2 && (
					<Step2VerificationForm
						email={email}
						cooldownSeconds={cooldownSeconds}
						onResend={(cooldown) => setCooldownSeconds(cooldown)}
						onSuccess={(token) => {
							setEmailVerificationToken(token);
							setCurrentStep(3);
						}}
						onEditEmail={() => setCurrentStep(1)}
						onError={() => {
							setCurrentStep(1);
							// TODO: set error here
							// setEmailError("root", {
							// 	message: "An unexpected error occurred. Please try again",
							// });
						}}
					/>
				)}
				{currentStep === 3 && (
					<Step3RegistrationForm
						email={email}
						emailVerificationToken={emailVerificationToken}
						onError={() => {
							setCurrentStep(1);
							// TODO: set error here
							// setEmailError("root", {
							// 	message: "An unexpected error occurred. Please try again",
							// });
						}}
						onInvalidEmailVerificationToken={(message) => {
							setCurrentStep(2);
							// TODO: set error here
							// setEmailVerificationError("emailVerificationToken", {
							// 	message: message,
							// });
						}}
					/>
				)}
			</CardBody>
			{currentStep === 1 && (
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
			)}
		</Card>
	);
}
