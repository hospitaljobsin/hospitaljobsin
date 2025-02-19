import ConfirmResetPasswordForm from "@/components/auth/ConfirmResetPasswordForm";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import type { pagePasswordResetTokenMetadataFragment$key } from "./__generated__/pagePasswordResetTokenMetadataFragment.graphql";
import type PasswordResetTokenViewQueryNode from "./__generated__/pagePasswordResetTokenQuery.graphql";
import type { pagePasswordResetTokenQuery } from "./__generated__/pagePasswordResetTokenQuery.graphql";

export const PagePasswordResetTokenQuery = graphql`
  query pagePasswordResetTokenQuery($resetToken: String!, $email: String!) {	
	...pagePasswordResetTokenMetadataFragment @arguments(resetToken: $resetToken, email: $email)
  }
`;

const PagePasswordResetTokenMetadataFragment = graphql`
 fragment pagePasswordResetTokenMetadataFragment on Query @inline @argumentDefinitions(
	resetToken: {
        type: "String!",
      },
	  email: {
		type: "String!"
	  }
    ) {
    passwordResetToken(resetToken: $resetToken, email: $email) {
      __typename	 
    }
  }
`;

const loadPasswordResetToken = cache(async (token: string, email: string) => {
	return await loadSerializableQuery<
		typeof PasswordResetTokenViewQueryNode,
		pagePasswordResetTokenQuery
	>(PagePasswordResetTokenQuery, {
		resetToken: token,
		email: email,
	});
});

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ token: string }>;
	searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
	const token = (await params).token;
	const email = searchParams?.email;

	if (!email) {
		return {
			title: "Invalid Password Reset Link",
			description: "The password reset link is either invalid or expired.",
		};
	}

	const preloadedQuery = await loadPasswordResetToken(token, String(email));

	const data = readInlineData<pagePasswordResetTokenMetadataFragment$key>(
		PagePasswordResetTokenMetadataFragment,
		preloadedQuery.data,
	);

	if (data.passwordResetToken.__typename !== "PasswordResetToken") {
		return {
			title: "Invalid Password Reset Link",
			description: "The password reset link is either invalid or expired.",
		};
	}

	return {
		title: "Password Reset",
	};
}

export default async function ConfirmResetPassword({
	params,
	searchParams,
}: {
	params: Promise<{ token: string }>;
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const token = (await params).token;
	const email = searchParams?.email;

	if (!email) {
		notFound();
	}

	const preloadedQuery = await loadPasswordResetToken(token, String(email));

	const data = readInlineData<pagePasswordResetTokenMetadataFragment$key>(
		PagePasswordResetTokenMetadataFragment,
		preloadedQuery.data,
	);

	if (data.passwordResetToken.__typename !== "PasswordResetToken") {
		notFound();
	}

	return <ConfirmResetPasswordForm />;
}
