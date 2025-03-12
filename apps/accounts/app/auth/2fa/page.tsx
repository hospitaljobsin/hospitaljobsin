import TwoFactorAuthenticationForm from "@/components/auth/two-factor/TwoFactorAuthenticationForm";

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Two Factor Authentication",
};

export default function TwoFactorAuthentication() {
	// we need to wrap the form in a Suspense component
	// because the form uses useSearchParams
	return (
		<Suspense>
			<TwoFactorAuthenticationForm />
		</Suspense>
	);
}
