import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useState } from "react";
import PhoneNumberEntryStep from "./PhoneNumberEntryStep";
import VerificationTokenStep from "./VerificationTokenStep";

type ModalStep = "phone-entry" | "verification";

type Props = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
};

export default function UpdatePhoneNumberModal({
	isOpen,
	onOpenChange,
	onClose,
}: Props) {
	const [currentStep, setCurrentStep] = useState<ModalStep>("phone-entry");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [phoneNumber, setPhoneNumber] = useState<string>("");

	function handleClose() {
		setCurrentStep("phone-entry"); // Reset to first step when closing
		setIsSubmitting(false);
		setError(null);
		setPhoneNumber("");
		onClose();
	}

	function handleOpenChange(isOpen: boolean) {
		if (!isOpen) {
			setCurrentStep("phone-entry"); // Reset to first step when closing
			setIsSubmitting(false);
			setError(null);
			setPhoneNumber("");
		}
		onOpenChange(isOpen);
	}

	function handlePhoneNumberSubmit(data: { phoneNumber: string }) {
		console.log("Phone number submitted:", data.phoneNumber);
		setError(null);
		setPhoneNumber(data.phoneNumber);
		setIsSubmitting(true);

		// The actual API call is now handled in PhoneNumberEntryStep
		// This is just for the step transition
		setTimeout(() => {
			setIsSubmitting(false);
			setCurrentStep("verification");
		}, 1000);
	}

	function handleVerificationSubmit(data: { verificationToken: string }) {
		console.log("Verification token submitted:", data.verificationToken);
		setError(null);
		setIsSubmitting(true);

		// TODO: Call verifyPhoneNumberVerificationToken mutation in Task 35
		setTimeout(() => {
			setIsSubmitting(false);
			handleClose();
		}, 1000);
	}

	function handleVerificationError(errorMessage: string) {
		setError(errorMessage);
		setIsSubmitting(false);
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={handleOpenChange}
			size="md"
			placement="center"
			isDismissable={!isSubmitting}
			className="p-4"
		>
			<ModalContent>
				<ModalHeader>
					{currentStep === "phone-entry"
						? "Update Phone Number"
						: "Verify Phone Number"}
				</ModalHeader>
				<ModalBody>
					{currentStep === "phone-entry" ? (
						<div className="flex flex-col gap-4">
							<PhoneNumberEntryStep
								onSubmit={handlePhoneNumberSubmit}
								isSubmitting={isSubmitting}
							/>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<p className="text-foreground-400 text-small">
								Enter the 6-digit verification code sent to your WhatsApp
								number.
							</p>
							{error && (
								<div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
									<p className="text-danger-600 text-sm">{error}</p>
								</div>
							)}
							<VerificationTokenStep
								onSubmit={handleVerificationSubmit}
								isSubmitting={isSubmitting}
								onError={handleVerificationError}
								phoneNumber={phoneNumber}
							/>
						</div>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
