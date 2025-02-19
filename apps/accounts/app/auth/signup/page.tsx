import SignUpForm from "@/components/auth/signup/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default function SignUp() {
	return <SignUpForm />;
}
