"use client";
import type { ProfileViewFragment$key } from "@/__generated__/ProfileViewFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import Certifications from "./Certifications";
import Education from "./Education";
import Languages from "./Languages";
import Licenses from "./Licenses";
import LocationPreferences from "./LocationPreferences";
import ProfileDetails from "./PersonalDetails";
import ProfileBanner from "./ProfileBanner";
import ProfileCompletionMeter from "./ProfileCompletionMeter";
import UpdateCertificationsForm from "./UpdateCertificationsForm";
import UpdateEducationForm from "./UpdateEducationForm";
import UpdateLanguagesForm from "./UpdateLanguagesForm";
import UpdateLicensesForm from "./UpdateLicensesForm";
import UpdateLocationPreferencesForm from "./UpdateLocationPreferencesForm";
import UpdateProfileDetailsForm from "./UpdatePersonalDetailsForm";
import UpdateWorkExperienceForm from "./UpdateWorkExperienceForm";
import WorkExperience from "./WorkExperience";

const ProfileViewFragment = graphql`
  fragment ProfileViewFragment on Query {
    viewer {
      __typename
      ... on Account {
        ...ProfileBannerFragment
        profile @required(action: THROW) {
          dateOfBirth
          address
          workExperience {
            __typename
          }
          education {
            __typename
          }
          locationsOpenToWork
          ...UpdatePersonalDetailsFormFragment
          ...PersonalDetailsFragment
          ...LanguagesFragment
          ...UpdateLanguagesFormFragment
          ...UpdateLocationPreferencesFormFragment
          ...LocationPreferencesFragment
          ...UpdateEducationFormFragment
          ...EducationFragment
          ...UpdateWorkExperienceFormFragment
          ...WorkExperienceFragment
          ...CertificationsFragment
          ...UpdateCertificationsFormFragment
          ...LicensesFragment
          ...UpdateLicensesFormFragment
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
	const [isEditingEducation, setIsEditingEducation] = useState(false);
	const [isEditingWorkExperience, setIsEditingWorkExperience] = useState(false);
	const [isEditingCertifications, setIsEditingCertifications] = useState(false);
	const [isEditingLicenses, setIsEditingLicenses] = useState(false);
	const data = useFragment(ProfileViewFragment, query);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	const completionStatus = {
		personalDetails: !!(
			data.viewer.profile.dateOfBirth && data.viewer.profile.address
		),
		workExperience: data.viewer.profile.workExperience.length > 0,
		education: data.viewer.profile.education.length > 0,
		locationPreferences: data.viewer.profile.locationsOpenToWork.length > 0,
	};

	return (
		<div className="w-full h-full space-y-16">
			<ProfileBanner account={data.viewer} />
			<ProfileCompletionMeter status={completionStatus} />
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

			{isEditingWorkExperience ? (
				<UpdateWorkExperienceForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingWorkExperience(false);
					}}
				/>
			) : (
				<WorkExperience
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingWorkExperience(true);
					}}
				/>
			)}
			{isEditingEducation ? (
				<UpdateEducationForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingEducation(false);
					}}
				/>
			) : (
				<Education
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingEducation(true);
					}}
				/>
			)}
			{isEditingCertifications ? (
				<UpdateCertificationsForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingCertifications(false);
					}}
				/>
			) : (
				<Certifications
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingCertifications(true);
					}}
				/>
			)}
			{isEditingLicenses ? (
				<UpdateLicensesForm
					rootQuery={data.viewer.profile}
					onSaveChanges={() => {
						setIsEditingLicenses(false);
					}}
				/>
			) : (
				<Licenses
					rootQuery={data.viewer.profile}
					onEditProfile={() => {
						setIsEditingLicenses(true);
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
		</div>
	);
}
