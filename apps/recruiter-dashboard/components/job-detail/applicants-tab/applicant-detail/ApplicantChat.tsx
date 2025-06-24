import type { ApplicantChatFragment$key } from "@/__generated__/ApplicantChatFragment.graphql";
import ChatInterface from "@/components/chat-interface/ChatInterface";
import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const ApplicantChatFragment = graphql`
  fragment ApplicantChatFragment on JobApplicant {
    account @required(action: THROW) {
      fullName
    }
  }
`;

export default function ApplicantChat({
	applicant,
}: { applicant: ApplicantChatFragment$key }) {
	const [showChatPopup, setShowChatPopup] = useState(false);
	const data = useFragment(ApplicantChatFragment, applicant);
	return (
		<>
			<div className="sticky top-0 h-screen min-w-[420px] max-w-[440px] w-full xl:flex flex-col border-l border-foreground-300 hidden">
				<ChatInterface
					placeholder={`Ask me anything about ${data.account.fullName}`}
				/>
			</div>
			<div className="block xl:hidden">
				<Button
					isIconOnly
					variant="solid"
					color="primary"
					className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
					size="lg"
					aria-label="Open chat"
					onPress={() => {
						setShowChatPopup(true);
					}}
				>
					<MessageCircleIcon className="w-7 h-7" />
				</Button>
				<Modal
					isOpen={showChatPopup}
					onOpenChange={(open) => setShowChatPopup(open)}
					className="block xl:hidden"
					backdrop="opaque"
					placement="center"
					size="full"
					motionProps={{
						initial: { opacity: 0, y: "100%" },
						animate: { opacity: 1, y: "0%" },
						exit: { opacity: 0, y: "100%" },
						transition: { type: "spring", stiffness: 400, damping: 40 },
					}}
				>
					<ModalContent className="w-full h-full max-w-full max-h-full rounded-none p-0">
						<ModalBody className="w-full h-full p-0 flex flex-col">
							<ChatInterface
								placeholder={`Ask me anything about ${data.account.fullName}`}
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			</div>
		</>
	);
}
