"use client";

import type { ResetPasswordViewFragment$key } from "@/__generated__/ResetPasswordViewFragment.graphql";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import ConfirmResetPasswordForm from "./ConfirmResetPasswordForm";
import ResetPasswordTwoFactorAuthentication from "./TwoFactorAuthentication";

const ResetPasswordViewFragment = graphql`
 fragment ResetPasswordViewFragment on PasswordResetToken {
	id
	needs2fa
	...TwoFactorAuthenticationResetPasswordFragment
  }
`;

export default function ResetPasswordView({
	rootQuery,
}: { rootQuery: ResetPasswordViewFragment$key }) {
	const params = useParams<{ token: string }>();

	const searchParams = useSearchParams();

	const email = searchParams.get("email") || "";

	const data = useFragment(ResetPasswordViewFragment, rootQuery);

	const [needs2fa, setNeeds2fa] = useState(data.needs2fa);

	if (needs2fa) {
		return (
			<ResetPasswordTwoFactorAuthentication
				email={email}
				resetToken={params.token}
				onComplete={() => setNeeds2fa(false)}
				passwordResetToken={data}
			/>
		);
	}

	return <ConfirmResetPasswordForm email={email} resetToken={params.token} />;
}
