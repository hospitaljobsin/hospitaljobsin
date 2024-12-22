"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import ProfileDetails from "./ProfileDetails";
import ProfileHeader from "./ProfileHeader";
import type { ProfileViewQuery as ProfileViewQueryType } from "./__generated__/ProfileViewQuery.graphql";

const ProfileViewQuery = graphql`
  query ProfileViewQuery {
    viewer {
      __typename
      ... on Account {
        ...ProfileHeaderFragment
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
		<>
			<ProfileHeader rootQuery={data.viewer} />
			<ProfileDetails rootQuery={data.viewer} />
		</>
	);
}
