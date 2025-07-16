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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";

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

const formSchema = z.object({
	file: z.instanceof(File),
	overwrite: z.boolean(),
});

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
		resetField,
		formState: { isSubmitting, isValid, isDirty },
	} = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			file: undefined,
			overwrite: true,
		},
		resolver: zodResolver(formSchema),
	});

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || null;
		if (file && file.type !== "application/pdf") {
			setError("Only PDF files are supported.");
			resetField("file", { keepError: true });
			return;
		}
		if (file && file.size > 5 * 1024 * 1024) {
			setError("File size must be less than 5MB.");
			resetField("file", { keepError: true });
			return;
		}
		if (file) {
			setError(null);
			setValue("file", file, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	}

	async function onSubmit(data: z.infer<typeof formSchema>) {
		return new Promise<void>((resolve, reject) => {
			if (data.file) {
				commitGeneratePresignedURL({
					variables: {
						contentType: "application/pdf",
					},
					onError(error) {
						onClose();
						addToast({
							description:
								"Failed to generate presigned URL. Please try again.",
							color: "danger",
						});
						reject(error);
					},
					onCompleted(response, errors) {
						const fileKey =
							response.generateProfileDocumentPresignedUrl.fileKey;
						const presignedUrl =
							response.generateProfileDocumentPresignedUrl.presignedUrl;
						uploadFileToS3(presignedUrl, data.file)
							.then(() => {
								commit({
									variables: { fileKey: fileKey, overwrite: data.overwrite },
									onCompleted: () => {
										onClose();
										addToast({
											description:
												"Profile updated! Please review and edit the updated sections.",
											color: "success",
										});
										resolve();
									},
									onError: (err) => {
										onClose();
										addToast({
											description:
												"Failed to autofill profile. Please try again.",
											color: "danger",
										});
										reject(err);
									},
								});
							})
							.catch((err) => {
								onClose();
								addToast({
									description: "Failed to autofill profile. Please try again.",
									color: "danger",
								});
								reject(err);
							});
					},
				});
			} else {
				setError("Please select a PDF file to upload.");
				reject(new Error("No file selected"));
			}
		});
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onClose}
			size="md"
			placement="center"
			isDismissable={!isSubmitting}
		>
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
										}}
										label="Upload your resume (PDF only)"
										className="w-full"
										errorMessage={error}
										isInvalid={!!error}
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
										<p className="text-base">
											Overwrite my profile with this document
										</p>
										<p className="text-xs text-foreground-600">
											(this will remove any information already saved in your
											profile)
										</p>
									</Checkbox>
								)}
							/>
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
							isDisabled={!isValid || !isDirty}
							isLoading={isSubmitting}
						>
							Upload
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
