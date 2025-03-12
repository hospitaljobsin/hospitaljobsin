import SignUpForm from "@/components/auth/signup/SignupForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default function SignUp() {
	// we need to wrap the form in a Suspense component
	// because the form uses useSearchParams
	return (
		<Suspense>
			<SignUpForm />
		</Suspense>
	);
}
