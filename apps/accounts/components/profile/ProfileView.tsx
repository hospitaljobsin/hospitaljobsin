"use client";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import AccountDetails from "./AccountDetails";
import Languages from "./Languages";
import ProfileDetails from "./PersonalDetails";
import UpdateAccountDetailsForm from "./UpdateAccountDetailsForm";
import UpdateLanguagesForm from "./UpdateLanguagesForm";
import UpdateProfileDetailsForm from "./UpdatePersonalDetailsForm";
import type { ProfileViewQuery as ProfileViewQueryType } from "./__generated__/ProfileViewQuery.graphql";

const ProfileViewQuery = graphql`
  query ProfileViewQuery {
    viewer {
      __typename
      ... on Account {
        ...AccountDetailsFragment
		...UpdateAccountDetailsFormFragment
		...UpdatePersonalDetailsFormFragment
        ...PersonalDetailsFragment
		...LanguagesFragment
		...UpdateLanguagesFormFragment
      }
    }
  }
`;

export default function ProfileView() {
	const [isEditingAccount, setIsEditingAccount] = useState(false);
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isEditingLanguages, setIsEditingLanguages] = useState(false);
	const data = useLazyLoadQuery<ProfileViewQueryType>(ProfileViewQuery, {});
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

			{isEditingProfile ? (
				<UpdateProfileDetailsForm
					rootQuery={data.viewer}
					onSaveChanges={() => {
						setIsEditingProfile(false);
					}}
				/>
			) : (
				<ProfileDetails
					rootQuery={data.viewer}
					onEditProfile={() => {
						setIsEditingProfile(true);
					}}
				/>
			)}
			{isEditingLanguages ? (
				<UpdateLanguagesForm
					rootQuery={data.viewer}
					onSaveChanges={() => {
						setIsEditingLanguages(false);
					}}
				/>
			) : (
				<Languages
					rootQuery={data.viewer}
					onEditProfile={() => {
						setIsEditingLanguages(true);
					}}
				/>
			)}
		</div>
	);
}
