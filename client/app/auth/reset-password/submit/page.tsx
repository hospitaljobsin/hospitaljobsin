import SubmitResetPasswordFrom from "@/components/auth/submit-reset-password-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Request Password Reset",
};

export default function SubmitResetPassword() {
	return <SubmitResetPasswordFrom />;
}
