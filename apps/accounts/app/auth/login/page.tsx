import LoginForm from "@/components/auth/LoginForm";

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Login",
};

export default function Login() {
	// we need to wrap the form in a Suspense component
	// because the form uses useSearchParams
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
