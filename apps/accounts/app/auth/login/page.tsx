import LoginForm from "@/components/auth/LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
};

export default function Login() {
	return (
		<>
			<LoginForm />
			<div className="text-center text-balance mt-6 text-xs w-full text-foreground-400 px-4">
				This site is protected by reCAPTCHA and the Google{" "}
				<a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
				<a href="https://policies.google.com/terms">Terms of Service</a> apply.
			</div>
		</>
	);
}
