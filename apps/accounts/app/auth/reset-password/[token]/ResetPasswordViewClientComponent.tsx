"use client";

import type { ResetPasswordViewClientComponentFragment$key } from "@/__generated__/ResetPasswordViewClientComponentFragment.graphql";
import type ResetPasswordViewQueryNode from "@/__generated__/pageResetPasswordViewQuery.graphql";
import type { pageResetPasswordViewQuery } from "@/__generated__/pageResetPasswordViewQuery.graphql";
import PageResetPasswordViewQuery from "@/__generated__/pageResetPasswordViewQuery.graphql";
import ResetPasswordView from "@/components/auth/reset-password/ResetPasswordView";
import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import {
	graphql,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} from "react-relay";
import invariant from "tiny-invariant";

const ResetPasswordViewClientComponentFragment = graphql`
 fragment ResetPasswordViewClientComponentFragment on Query  @argumentDefinitions(
	resetToken: {
        type: "String!",
      },
	  email: {
		type: "String!"
	  }
    ) {
    passwordResetToken(resetToken: $resetToken, email: $email) {
        __typename
      ... on PasswordResetToken {
        ...ResetPasswordViewFragment
      }
    }
  }
`;

export default function ResetPasswordViewClientComponent(props: {
	preloadedQuery: SerializablePreloadedQuery<
		typeof ResetPasswordViewQueryNode,
		pageResetPasswordViewQuery
	>;
}) {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery<
		typeof ResetPasswordViewQueryNode,
		pageResetPasswordViewQuery
	>(environment, props.preloadedQuery, "store-or-network");

	const data = usePreloadedQuery(PageResetPasswordViewQuery, queryRef);

	const rootQuery = useFragment<ResetPasswordViewClientComponentFragment$key>(
		ResetPasswordViewClientComponentFragment,
		data,
	);

	invariant(
		rootQuery.passwordResetToken.__typename === "PasswordResetToken",
		"Expected password reset token.",
	);

	return <ResetPasswordView rootQuery={rootQuery.passwordResetToken} />;
}
