import type { AutofillWithAIModalGeneratePresignedURLMutation } from "@/__generated__/AutofillWithAIModalGeneratePresignedURLMutation.graphql";
import type { AutofillWithAIModalMutation } from "@/__generated__/AutofillWithAIModalMutation.graphql";
import { uploadFileToS3 } from "@/lib/presignedUrl";
import {
	Button,
	Checkbox,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";

const ParseProfileDocumentMutation = graphql`
  mutation AutofillWithAIModalMutation($fileKey: String!, $overwrite: Boolean!) {
    parseProfileDocument(fileKey: $fileKey, overwrite: $overwrite) {
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
      }
    }
  }
`;

const GenerateProfileDocumentPresignedURLMutation = graphql`
  mutation AutofillWithAIModalGeneratePresignedURLMutation($contentType: String!) {
    generateProfileDocumentPresignedUrl(contentType: $contentType) {
      presignedUrl
	  fileKey
    }
  }
`;
export default function AutofillWithAIModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [commit, isParsingProfile] = useMutation<AutofillWithAIModalMutation>(
		ParseProfileDocumentMutation,
	);
	const [commitGeneratePresignedURL, isGeneratingPresignedURL] =
		useMutation<AutofillWithAIModalGeneratePresignedURLMutation>(
			GenerateProfileDocumentPresignedURLMutation,
		);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { isSubmitting },
	} = useForm<{
		file: File | null;
		overwrite: boolean;
	}>({
		defaultValues: {
			file: null,
			overwrite: true,
		},
	});

	const selectedFile = watch("file");

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || null;
		if (file && file.type !== "application/pdf") {
			setError("Only PDF files are supported.");
			setValue("file", null);
			return;
		}
		setError(null);
		setValue("file", file);
	}

	const handleFileUpload = async (file: File, overwrite: boolean) => {
		commitGeneratePresignedURL({
			variables: {
				contentType: "application/pdf",
			},
			onError(error) {
				onClose();
				addToast({
					description: "Failed to generate presigned URL. Please try again.",
					color: "danger",
				});
				return;
			},
			onCompleted(response, errors) {
				const fileKey = response.generateProfileDocumentPresignedUrl.fileKey;
				const presignedUrl =
					response.generateProfileDocumentPresignedUrl.presignedUrl;
				uploadFileToS3(presignedUrl, file)
					.then(() => {
						commit({
							variables: { fileKey: fileKey, overwrite },
							onCompleted: () => {
								onClose();
								addToast({
									description:
										"Profile updated! You can review and edit any section below.",
									color: "success",
								});
							},
							onError: () => {
								onClose();
								addToast({
									description: "Failed to autofill profile. Please try again.",
									color: "danger",
								});
							},
						});
					})
					.catch(() => {
						onClose();
						addToast({
							description: "Failed to autofill profile. Please try again.",
							color: "danger",
						});
					});
			},
		});
	};

	function onSubmit(data: { file: File | null; overwrite: boolean }) {
		if (data.file) {
			handleFileUpload(data.file, data.overwrite);
		} else {
			setError("Please select a PDF file to upload.");
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="md" placement="center">
			<ModalContent>
				<ModalHeader>Autofill with AI</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalBody>
						<div className="flex flex-col gap-4">
							<Controller
								name="file"
								control={control}
								render={({ field }) => (
									<Input
										ref={fileInputRef}
										type="file"
										accept="application/pdf"
										onChange={(e) => {
											handleFileChange(e);
											field.onChange(e.target.files?.[0] || null);
										}}
										label="Upload your resume (PDF only)"
										className="w-full"
									/>
								)}
							/>
							<Controller
								name="overwrite"
								control={control}
								render={({ field }) => (
									<Checkbox
										isSelected={field.value}
										onValueChange={field.onChange}
										className="mt-2"
									>
										Overwrite my entire profile with values from this document
									</Checkbox>
								)}
							/>
							{error && <span className="text-danger text-sm">{error}</span>}
						</div>
					</ModalBody>
					<ModalFooter className="flex gap-4 items-center w-full flex-row">
						<Button variant="flat" onPress={onClose} fullWidth type="button">
							Cancel
						</Button>
						<Button
							color="primary"
							fullWidth
							type="submit"
							isDisabled={!selectedFile}
							isLoading={
								isSubmitting || isParsingProfile || isGeneratingPresignedURL
							}
						>
							Upload
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
