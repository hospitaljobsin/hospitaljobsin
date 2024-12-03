import SubmitResetPasswordFrom from "@/components/auth/submit-reset-password-form";

import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Request Password Reset | ${APP_NAME}`,
};

export default function SubmitResetPassword() {
  return <SubmitResetPasswordFrom />;
}
