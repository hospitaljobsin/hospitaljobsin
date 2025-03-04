"use client";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import AccountDetails from "./AccountDetails";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import UpdateAccountDetailsForm from "./UpdateAccountDetailsForm";
import type { AccountSettingsViewQuery as AccountSettingsViewQueryType } from "./__generated__/AccountSettingsViewQuery.graphql";

const AccountSettingsViewQuery = graphql`
  query AccountSettingsViewQuery {
    viewer {
      __typename
      ... on Account {
        ...AccountDetailsFragment
		...UpdateAccountDetailsFormFragment
		...TwoFactorAuthenticationFragment
      }
    }
  }
`;

export default function AccountSettingsView() {
	const [isEditingAccount, setIsEditingAccount] = useState(false);
	const data = useLazyLoadQuery<AccountSettingsViewQueryType>(
		AccountSettingsViewQuery,
		{},
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

			<TwoFactorAuthentication rootQuery={data.viewer} />
		</div>
	);
}
