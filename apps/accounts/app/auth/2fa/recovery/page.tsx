import TwoFactorRecoveryCodeForm from "@/components/auth/two-factor/TwoFactorRecoveryCodeForm";

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Two Factor Recovery",
};

export default function TwoFactorRecovery() {
	// we need to wrap the form in a Suspense component
	// because the form uses useSearchParams
	return (
		<Suspense>
			<TwoFactorRecoveryCodeForm />
		</Suspense>
	);
}
