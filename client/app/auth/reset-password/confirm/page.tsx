import ConfirmResetPasswordForm from "@/components/auth/confirm-reset-password-form";

import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Reset Password | ${APP_NAME}`,
};

export default function ConfirmResetPassword() {
  return <ConfirmResetPasswordForm />;
}
