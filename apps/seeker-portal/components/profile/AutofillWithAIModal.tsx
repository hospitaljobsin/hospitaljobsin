import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useRef, useState } from "react";

export default function AutofillWithAIModal({
	isOpen,
	onClose,
	onFileUpload,
}: {
	isOpen: boolean;
	onClose: () => void;
	onFileUpload: (file: File) => void;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || null;
		if (file && file.type !== "application/pdf") {
			setError("Only PDF files are supported.");
			setSelectedFile(null);
			return;
		}
		setError(null);
		setSelectedFile(file);
	}

	function handleUpload() {
		if (selectedFile) {
			onFileUpload(selectedFile);
		} else {
			setError("Please select a PDF file to upload.");
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="md" placement="center">
			<ModalContent>
				<ModalHeader>Autofill with AI</ModalHeader>
				<ModalBody>
					<div className="flex flex-col gap-4">
						<Input
							ref={fileInputRef}
							type="file"
							accept="application/pdf"
							onChange={handleFileChange}
							label="Upload your resume (PDF only)"
							className="w-full"
						/>
						{error && <span className="text-danger text-sm">{error}</span>}
					</div>
				</ModalBody>
				<ModalFooter className="flex gap-4 items-center w-full flex-row">
					<Button variant="flat" onPress={onClose} fullWidth>
						Cancel
					</Button>
					<Button color="primary" onPress={handleUpload} fullWidth>
						Upload
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
