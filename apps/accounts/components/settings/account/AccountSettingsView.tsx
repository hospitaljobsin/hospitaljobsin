"use client";
import type { AccountClientComponentQuery as AccountClientComponentQueryType } from "@/__generated__/AccountClientComponentQuery.graphql";
import AccountClientComponentQuery from "@/__generated__/AccountClientComponentQuery.graphql";
import type { AccountSettingsViewFragment$key } from "@/__generated__/AccountSettingsViewFragment.graphql";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import AccountDetails from "./AccountDetails";
import Password from "./Password";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import UpdateAccountDetailsForm from "./UpdateAccountDetailsForm";

const AccountSettingsViewFragment = graphql`
  fragment AccountSettingsViewFragment on Query {
    viewer {
      __typename
      ... on Account {
        ...AccountDetailsFragment
		...UpdateAccountDetailsFormFragment
		...TwoFactorAuthenticationFragment
		...PasswordFragment
      }
    }
  }
`;

export default function AccountSettingsView({
	queryReference,
}: {
	queryReference: PreloadedQuery<AccountClientComponentQueryType>;
}) {
	const [isEditingAccount, setIsEditingAccount] = useState(false);
	const query = usePreloadedQuery(AccountClientComponentQuery, queryReference);
	const data = useFragment<AccountSettingsViewFragment$key>(
		AccountSettingsViewFragment,
		query,
	);

	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-16">
			{isEditingAccount ? (
				<UpdateAccountDetailsForm
					rootQuery={data.viewer}
					onSaveChanges={() => {
						setIsEditingAccount(false);
					}}
				/>
			) : (
				<AccountDetails
					rootQuery={data.viewer}
					onEditAccount={() => {
						setIsEditingAccount(true);
					}}
				/>
			)}

			<Password rootQuery={data.viewer} />

			<TwoFactorAuthentication rootQuery={data.viewer} />
		</div>
	);
}
