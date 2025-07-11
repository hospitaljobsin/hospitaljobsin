"use client";

import { env } from "@/lib/env/client";
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
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getValidRedirectURL } from "../../../lib/redirects";
import SignupContext from "./SignupContext";
import Step1EmailForm from "./Step1EmailForm";
import Step2VerificationForm from "./Step2VerificationForm";
import Step3NameForm from "./Step3NameForm";
import Step4RegistrationForm from "./step4-register/Step4RegistrationForm";

export default function SignUpWizard() {
	const state = SignupContext.useSelector((state) => state);
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));

	useEffect(() => {
		// prevent user from leaving the page while completing registration
		if (state.value === "step4" || state.value === "step1") return;

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
				) : state.matches("step3") ? (
					<Step3NameForm />
				) : (
					<Step4RegistrationForm />
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
						as="a"
						href={`${env.NEXT_PUBLIC_API_URL}/auth/signin/google?redirect_uri=${encodeURIComponent(redirectTo)}`}
						target="_self"
					>
						Sign up with Google
					</Button>
					<div className="flex justify-center w-full">
						<Link
							href={links.login(params.get("return_to"))}
							className="cursor-pointer text-blue-500 text-small sm:text-sm text-center"
						>
							Already have an account? Log in.
						</Link>
					</div>
				</CardFooter>
			)}
		</Card>
	);
}
