"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import ConfirmResetPasswordForm from "./ConfirmResetPasswordForm";
import ResetPasswordTwoFactorAuthentication from "./ResetPasswordTwoFactorAuthentication";
import type { ResetPasswordViewFragment$key } from "./__generated__/ResetPasswordViewFragment.graphql";

const ResetPasswordViewFragment = graphql`
 fragment ResetPasswordViewFragment on PasswordResetToken {
	id
	needs2fa
  }
`;

export default function ResetPasswordView({
	rootQuery,
}: { rootQuery: ResetPasswordViewFragment$key }) {
	const params = useParams<{ token: string }>();

	const searchParams = useSearchParams();

	const email = searchParams.get("email") || "";

	const data = useFragment(ResetPasswordViewFragment, rootQuery);

	if (data.needs2fa) {
		return (
			<ResetPasswordTwoFactorAuthentication
				email={email}
				resetToken={params.token}
			/>
		);
	}

	return <ConfirmResetPasswordForm email={email} resetToken={params.token} />;
}
