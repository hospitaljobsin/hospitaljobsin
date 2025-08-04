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
import { useNavigationGuard } from "next-navigation-guard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

	useNavigationGuard({
		enabled: () => state.value !== "step4" && state.value !== "step1",
		confirm: () => window.confirm("Are you sure you want to leave this page?"),
	});

	return (
		<>
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex flex-col gap-2">
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
								className="cursor-pointer text-primary-600 text-small sm:text-sm text-center"
							>
								Already have an account? Log in.
							</Link>
						</div>
					</CardFooter>
				)}
			</Card>
			<div className="text-center text-sm text-gray-500 mt-8">
				By creating an account, you agree to the <br />
				<Link href={links.terms} target="_blank" className="text-primary-600">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link target="_blank" href={links.privacy} className="text-primary-600">
					Privacy Policy
				</Link>
				.
			</div>
		</>
	);
}
