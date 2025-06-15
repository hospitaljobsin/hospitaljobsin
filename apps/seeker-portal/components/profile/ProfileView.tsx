"use client";
import type { ProfileViewFragment$key } from "@/__generated__/ProfileViewFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import Languages from "./Languages";
import LocationPreferences from "./LocationPreferences";
import ProfileDetails from "./PersonalDetails";
import UpdateLanguagesForm from "./UpdateLanguagesForm";
import UpdateLocationPreferencesForm from "./UpdateLocationPreferencesForm";
import UpdateProfileDetailsForm from "./UpdatePersonalDetailsForm";

const ProfileViewFragment = graphql`
  fragment ProfileViewFragment on Query {
    viewer {
      __typename
      ... on Account {
		profile @required(action: THROW) {
			...UpdatePersonalDetailsFormFragment
			...PersonalDetailsFragment
			...LanguagesFragment
			...UpdateLanguagesFormFragment
			...UpdateLocationPreferencesFormFragment
			...LocationPreferencesFragment
		}
      }
    }
  }
`;

export default function ProfileView({
	query,
}: {
	query: ProfileViewFragment$key;
}) {
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isEditingLanguages, setIsEditingLanguages] = useState(false);
	const [isEditingLocationPreferences, setIsEditingLocationPreferences] =
		useState(false);
	const data = useFragment(ProfileViewFragment, query);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-16">
			{isEditingProfile ? (
				<UpdateProfileDetailsForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingProfile(false);
					}}
				/>
			) : (
				<ProfileDetails
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingProfile(true);
					}}
				/>
			)}
			{isEditingLanguages ? (
				<UpdateLanguagesForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingLanguages(false);
					}}
				/>
			) : (
				<Languages
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingLanguages(true);
					}}
				/>
			)}
			{isEditingLocationPreferences ? (
				<UpdateLocationPreferencesForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingLocationPreferences(false);
					}}
				/>
			) : (
				<LocationPreferences
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingLocationPreferences(true);
					}}
				/>
			)}
		</div>
	);
}
