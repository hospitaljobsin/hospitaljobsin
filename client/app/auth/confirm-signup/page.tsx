import ConfirmSignUpForm from "@/components/auth/confirm-signup-form";

import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Confirm Sign up | ${APP_NAME}`,
};

export default function LoginPage() {
  return <ConfirmSignUpForm />;
}
