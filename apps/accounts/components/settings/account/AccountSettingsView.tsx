"use client";
import type { AccountSettingsViewQuery as AccountSettingsViewQueryType } from "@/__generated__/AccountSettingsViewQuery.graphql";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import AccountDetails from "./AccountDetails";
import Password from "./Password";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import UpdateAccountDetailsForm from "./UpdateAccountDetailsForm";

const AccountSettingsViewQuery = graphql`
  query AccountSettingsViewQuery {
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

export default function AccountSettingsView() {
	const [isEditingAccount, setIsEditingAccount] = useState(false);
	const data = useLazyLoadQuery<AccountSettingsViewQueryType>(
		AccountSettingsViewQuery,
		{},
		{ fetchPolicy: "store-or-network" },
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
