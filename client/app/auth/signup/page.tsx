import SignUpForm from "@/components/auth/signup-form";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign Up | ${APP_NAME}`,
};

export default function SignUp() {
  return <SignUpForm />;
}
