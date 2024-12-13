import LoginForm from "@/components/auth/LoginForm";

import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Login | ${APP_NAME}`,
};

export default function Login() {
  return <LoginForm />;
}
