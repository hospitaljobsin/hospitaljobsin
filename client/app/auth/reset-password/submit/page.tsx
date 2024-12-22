import SubmitResetPasswordFrom from "@/components/auth/SubmitResetPasswordForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Request Password Reset",
};

export default function SubmitResetPassword() {
	return <SubmitResetPasswordFrom />;
}
