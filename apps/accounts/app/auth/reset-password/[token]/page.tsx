import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import type { pagePasswordResetTokenMetadataFragment$key } from "@/__generated__/pagePasswordResetTokenMetadataFragment.graphql";
import type PasswordResetTokenViewQueryNode from "@/__generated__/pageResetPasswordViewQuery.graphql";
import type { pageResetPasswordViewQuery } from "@/__generated__/pageResetPasswordViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import ResetPasswordViewClientComponent from "./ResetPasswordViewClientComponent";

export const PageResetPasswordViewQuery = graphql`
  query pageResetPasswordViewQuery($resetToken: String!, $email: String!) {
	...pagePasswordResetTokenMetadataFragment @arguments(resetToken: $resetToken, email: $email)
	...ResetPasswordViewClientComponentFragment @arguments(resetToken: $resetToken, email: $email)
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
		pageResetPasswordViewQuery
	>(PageResetPasswordViewQuery, {
		resetToken: token,
		email: email,
	});
});

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ token: string }>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
	const token = (await params).token;
	const email = (await searchParams)?.email;

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
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const token = (await params).token;
	const email = (await searchParams)?.email;

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

	return (
		<>
			<ResetPasswordViewClientComponent preloadedQuery={preloadedQuery} />
			<div className="text-center text-balance mt-6 text-xs w-full text-foreground-400 px-4">
				This site is protected by Cloudflare Turnstile and the{" "}
				<a
					href="https://www.cloudflare.com/privacypolicy/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Cloudflare Privacy Policy
				</a>{" "}
				applies.
			</div>
		</>
	);
}
