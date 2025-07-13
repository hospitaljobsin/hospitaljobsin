import type {
	AutofillWithAISectionFragment$data,
	AutofillWithAISectionFragment$key,
} from "@/__generated__/AutofillWithAISectionFragment.graphql";
import type { AutofillWithAISectionMutation } from "@/__generated__/AutofillWithAISectionMutation.graphql";
import { Button, Card, CardBody, CardHeader, addToast } from "@heroui/react";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import AutofillWithAIModal from "./AutofillWithAIModal";

const ParseProfileDocumentMutation = graphql`
  mutation AutofillWithAISectionMutation($document: Upload!) {
    parseProfileDocument(document: $document) {
      ... on BaseProfile {
        address
        headline
        professionalSummary
        dateOfBirth
        openToRelocationAnywhere
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
		  ...AboutMeFragment
		  ...UpdateAboutMeFormFragment
		  ...AutofillWithAISectionFragment
      }
    }
  }
`;

const AutofillWithAISectionFragment = graphql`
  fragment AutofillWithAISectionFragment on BaseProfile {
    address
    headline
    professionalSummary
    dateOfBirth
    gender
    maritalStatus
    category
    openToRelocationAnywhere
    locationsOpenToWork
    workExperience { __typename }
    education { __typename }
    languages { __typename }
    licenses { __typename }
    certifications { __typename }
  }
`;

function isProfileEmpty(profile: AutofillWithAISectionFragment$data): boolean {
	if (!profile) return true;
	const fields = [
		profile.address,
		profile.headline,
		profile.professionalSummary,
		profile.dateOfBirth,
		profile.openToRelocationAnywhere,
		profile.locationsOpenToWork && profile.locationsOpenToWork.length > 0,
	];
	return fields.filter(Boolean).length === 0;
}

export default function AutofillWithAISection({
	profile,
}: {
	profile: AutofillWithAISectionFragment$key;
}) {
	const data = useFragment(AutofillWithAISectionFragment, profile);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [commit] = useMutation<AutofillWithAISectionMutation>(
		ParseProfileDocumentMutation,
	);

	// New: handle button click to show confirmation if not empty
	const handleAutofillClick = () => {
		if (isProfileEmpty(data)) {
			setIsModalOpen(true);
		} else {
			setIsConfirmOpen(true);
		}
	};

	// After confirmation, show file upload modal
	const handleConfirm = () => {
		setIsConfirmOpen(false);
		setIsModalOpen(true);
	};

	const handleFileUpload = async (file: File) => {
		setIsLoading(true);
		commit({
			variables: { document: null },
			uploadables: {
				document: file,
			},
			onCompleted: () => {
				setIsLoading(false);
				setIsModalOpen(false);
				addToast({
					description:
						"Profile updated! You can review and edit any section below.",
					color: "success",
				});
			},
			onError: () => {
				setIsLoading(false);
				setIsModalOpen(false);
				addToast({
					description: "Failed to autofill profile. Please try again.",
					color: "danger",
				});
			},
		});
	};

	return (
		<Card className="p-6" shadow="none">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
				<div className="flex items-center gap-2">
					<Sparkles className="text-primary" size={20} />
					<span className="font-semibold text-lg">Autofill with AI</span>
				</div>
				<span className="text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-4">
					Upload your resume to quickly fill your profile.
				</span>
			</CardHeader>
			<CardBody>
				<Button
					variant="flat"
					size="md"
					onClick={handleAutofillClick}
					isLoading={isLoading}
				>
					<Sparkles className="mr-2" size={18} />
					Autofill with AI
				</Button>
				<AutofillWithAIModal
					isOpen={isModalOpen}
					onClose={() => {
						if (!isLoading) setIsModalOpen(false);
					}}
					onFileUpload={handleFileUpload}
				/>
				{/* Confirmation Modal BEFORE file upload if profile is not empty */}
				{isConfirmOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
							<h2 className="font-semibold text-lg mb-2">Overwrite Profile?</h2>
							<p className="mb-4 text-sm text-gray-600">
								Autofill will overwrite your existing profile details. Are you
								sure you want to continue?
							</p>
							<div className="flex justify-end gap-2">
								<Button
									variant="flat"
									onClick={() => {
										setIsConfirmOpen(false);
									}}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button
									color="danger"
									onClick={handleConfirm}
									isLoading={isLoading}
								>
									Yes, Autofill
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
