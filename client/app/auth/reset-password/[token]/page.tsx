import ConfirmResetPasswordForm from "@/components/auth/ConfirmResetPasswordForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset Password",
};

export default function ConfirmResetPassword() {
	return <ConfirmResetPasswordForm />;
}
