import SubmitResetPasswordFrom from "@/components/auth/SubmitResetPasswordForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset Password",
};

export default function SubmitResetPassword() {
	return <SubmitResetPasswordFrom />;
}
