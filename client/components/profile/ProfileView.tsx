"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
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
	const data = useLazyLoadQuery<ProfileViewQueryType>(ProfileViewQuery, {});
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-12">
			<ProfileHeader rootQuery={data.viewer} />
			<UpdateProfileDetailsForm rootQuery={data.viewer} />
		</div>
	);
}
