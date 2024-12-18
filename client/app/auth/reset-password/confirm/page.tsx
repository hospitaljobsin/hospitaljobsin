import ConfirmResetPasswordForm from "@/components/auth/confirm-reset-password-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset Password",
};

export default function ConfirmResetPassword() {
	return <ConfirmResetPasswordForm />;
}
