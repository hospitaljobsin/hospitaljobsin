import TwoFactorRecoveryCodeForm from "@/components/auth/two-factor/TwoFactorRecoveryCodeForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Two Factor Recovery",
};

export default function Login() {
	return <TwoFactorRecoveryCodeForm />;
}
