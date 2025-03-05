import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { Clipboard, DownloadIcon } from "lucide-react";

export default function SaveRecoveryCodesModal({
	isOpen,
	onOpenChange,
	recoveryCodes,
	onClose,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	recoveryCodes: readonly string[];
	onClose: () => void;
}) {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="xl"
			scrollBehavior="inside"
			isDismissable={false}
		>
			<ModalContent className="flex flex-col w-full gap-6 p-4 sm:p-6">
				<ModalHeader className="flex flex-col gap-4 w-full">
					<h2 className="text-lg font-medium">Save your recovery codes</h2>
					<p className="text-foreground-400 text-small font-normal w-full">
						Please save your recovery codes in a safe place. You can use these
						codes to access your account if you lose access to your 2FA app.
					</p>
				</ModalHeader>

				<ModalBody className="w-full flex flex-col gap-8 items-start">
					<div className="w-full flex flex-col gap-12">
						<div className="w-full flex items-center justify-start gap-6">
							<Button
								variant="bordered"
								size="sm"
								startContent={<Clipboard size={16} />}
								onPress={() =>
									navigator.clipboard.writeText(recoveryCodes.join("\n"))
								}
							>
								Copy all codes
							</Button>
							<Button
								variant="bordered"
								size="sm"
								startContent={<DownloadIcon size={16} />}
								onPress={() => {
									const blob = new Blob([recoveryCodes.join("\n")], {
										type: "text/plain",
									});
									const url = URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = url;
									a.download = "recovery-codes.txt";
									a.click();
									URL.revokeObjectURL(url);
								}}
							>
								Export to TXT
							</Button>
						</div>
						<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
							{recoveryCodes.map((code) => (
								<h3 key={code} className="text-lg font-semibold">
									{code}
								</h3>
							))}
						</div>
						<p className="w-full text-foreground-400 text-small">
							You can regenerate these recovery codes (if you've exhausted this
							set), but only the latest set of codes will work
						</p>
					</div>
				</ModalBody>
				<ModalFooter className="w-full">
					<Button onPress={onClose} fullWidth color="primary">
						I've saved my recovery codes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
