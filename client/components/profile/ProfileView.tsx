"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import EmploymentDetails from "./EmploymentDetails";
import PersonalDetails from "./PersonalDetails";
import ProfileHeader from "./ProfileHeader";
import type { ProfileViewQuery as ProfileViewQueryType } from "./__generated__/ProfileViewQuery.graphql";

const ProfileViewQuery = graphql`
  query ProfileViewQuery {
    viewer {
      __typename
      ... on Account {
        ...ProfileHeaderFragment
        ...PersonalDetailsFragment
        ...EmploymentDetailsFragment
      }
    }
  }
`;

export default function ProfileView() {
	const data = useLazyLoadQuery<ProfileViewQueryType>(ProfileViewQuery, {});

	if (data.viewer.__typename !== "Account") {
		return null;
	}

	return (
		<>
			<ProfileHeader rootQuery={data.viewer} />
			<PersonalDetails rootQuery={data.viewer} />
			<EmploymentDetails rootQuery={data.viewer} />
		</>
	);
}
