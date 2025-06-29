"use client";
import type { ProfileSnapshotViewFragment$key } from "@/__generated__/ProfileSnapshotViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import AboutMe from "./profile-snapshot/AboutMe";
import Certifications from "./profile-snapshot/Certifications";
import Education from "./profile-snapshot/Education";
import Languages from "./profile-snapshot/Languages";
import Licenses from "./profile-snapshot/Licenses";
import LocationPreferences from "./profile-snapshot/LocationPreferences";
import PersonalDetails from "./profile-snapshot/PersonalDetails";
import WorkExperience from "./profile-snapshot/WorkExperience";

const ProfileSnapshotViewFragment = graphql`
	fragment ProfileSnapshotViewFragment on JobApplicant {
		...AboutMeFragment
		...CertificationsFragment
		...EducationFragment
		...LanguagesFragment
		...LicensesFragment
		...LocationPreferencesFragment
		...PersonalDetailsFragment
		...WorkExperienceFragment
	}
`;

export default function ProfileSnapshotView(props: {
	jobApplicant: ProfileSnapshotViewFragment$key;
}) {
	const data = useFragment(ProfileSnapshotViewFragment, props.jobApplicant);

	return (
		<div className="w-full h-full space-y-16">
			<AboutMe rootQuery={data} />
			<PersonalDetails rootQuery={data} />

			<WorkExperience rootQuery={data} />
			<Education rootQuery={data} />
			<Certifications rootQuery={data} />
			<Licenses rootQuery={data} />
			<LocationPreferences rootQuery={data} />
			<Languages rootQuery={data} />
		</div>
	);
}
