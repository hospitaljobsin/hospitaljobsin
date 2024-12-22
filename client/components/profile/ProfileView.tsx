"use client";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import ProfileDetails from "./ProfileDetails";
import ProfileHeader from "./ProfileHeader";
import UpdateProfileDetailsForm from "./UpdateProfileDetailsForm";
import type { ProfileViewQuery as ProfileViewQueryType } from "./__generated__/ProfileViewQuery.graphql";

const ProfileViewQuery = graphql`
  query ProfileViewQuery {
    viewer {
      __typename
      ... on Account {
        ...ProfileHeaderFragment
		...UpdateProfileDetailsFormFragment
        ...ProfileDetailsFragment
      }
    }
  }
`;

export default function ProfileView() {
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const data = useLazyLoadQuery<ProfileViewQueryType>(ProfileViewQuery, {});
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-12">
			<ProfileHeader rootQuery={data.viewer} />
			{isEditingProfile ? (
				<UpdateProfileDetailsForm rootQuery={data.viewer} />
			) : (
				<ProfileDetails rootQuery={data.viewer} />
			)}
		</div>
	);
}
