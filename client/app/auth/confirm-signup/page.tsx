import ConfirmSignUpForm from "@/components/auth/ConfirmSignupForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Confirm Sign up",
};

export default function LoginPage() {
	return <ConfirmSignUpForm />;
}
