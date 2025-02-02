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
import { useEffect } from "react";
import SignupContext from "./SignupContext";
import Step1EmailForm from "./Step1EmailForm";
import Step2VerificationForm from "./Step2VerificationForm";
import Step3RegistrationForm from "./Step3RegistrationForm";

export default function SignUpWizard() {
	const state = SignupContext.useSelector((state) => state);

	useEffect(() => {
		// prevent user from leaving the page while completing registration
		if (state.value === "step1") return;

		function beforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
		}

		window.addEventListener("beforeunload", beforeUnload);

		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [state.value]);

	return (
		<Card className="p-6 space-y-6" shadow="none">
			<CardHeader>
				<h1 className="text-2xl text-center w-full">Create your account</h1>
			</CardHeader>
			<CardBody className="space-y-6">
				{state.matches("step1") ? (
					<Step1EmailForm />
				) : state.matches("step2") ? (
					<Step2VerificationForm />
				) : (
					<Step3RegistrationForm />
				)}
			</CardBody>
			{state.matches("step1") && (
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
