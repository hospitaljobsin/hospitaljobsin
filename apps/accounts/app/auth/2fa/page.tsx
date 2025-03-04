import TwoFactorAuthenticationForm from "@/components/auth/TwoFactorAuthenticationForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Two Factor Authentication",
};

export default function Login() {
	return <TwoFactorAuthenticationForm />;
}
