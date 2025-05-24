"use client";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { ProfileClientComponentFragment$key } from "@/__generated__/ProfileClientComponentFragment.graphql";
import type { pageProfileQuery } from "@/__generated__/pageProfileQuery.graphql";
import ProfileView from "@/components/profile/ProfileView";
import { ProfilePageQuery } from "./page";

const ProfileClientComponentFragment = graphql`
  fragment ProfileClientComponentFragment on Query{
    ...ProfileViewFragment
  }
`;

export default function ProfileClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pageProfileQuery>;
}) {
	const data = usePreloadedQuery(ProfilePageQuery, queryReference);
	const query = useFragment<ProfileClientComponentFragment$key>(
		ProfileClientComponentFragment,
		data,
	);
	return <ProfileView query={query} />;
}
