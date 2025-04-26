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
				This site is protected by Cloudflare Turnstile and the{" "}
				<a
					href="https://www.cloudflare.com/privacypolicy/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Cloudflare Privacy Policy
				</a>{" "}
				applies.
			</div>
		</>
	);
}
