"use client";

import { useMessageViewer } from "@/components/MessageViewerProvider";
import ChatInterface from "@/components/chat-interface/ChatInterface";
import HeaderClientComponent from "@/components/layout/HeaderClientComponent";
import { ChatContextProvider } from "@/components/message-viewer/ChatContext";
import MessageViewer from "@/components/message-viewer/MessageViewer";
import { Suggestions } from "@/components/message-viewer/Suggestions";
import { useCopilotChatLogic } from "@/lib/hooks/useCopilotChatLogic";
import { AnimatePresence, motion } from "motion/react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showMessageViewer } = useMessageViewer();
	const {
		visibleMessages,
		isLoading,
		currentSuggestions,
		sendMessage,
		// stopGeneration,
		reloadMessages,
	} =
		useCopilotChatLogic(
			// makeSystemMessage,
			// onInProgress,
			// onSubmitMessage,
			// onStopGeneration,
			// onReloadMessages,
		);

	const handleRegenerate = (messageId: string) => {
		// if (onRegenerate) {
		// 	onRegenerate(messageId);
		// }

		reloadMessages(messageId);
	};

	const handleCopy = (message: string) => {
		// if (onCopy) {
		// 	onCopy(message);
		// }
	};

	const handleSendMessage = (text: string) => {
		// const images = selectedImages;
		// setSelectedImages([]);
		// if (fileInputRef.current) {
		// 	fileInputRef.current.value = "";
		// }

		// return sendMessage(text, images);
		return sendMessage(text);
	};

	return (
		<div className="flex flex-col h-full w-full">
			<HeaderClientComponent />
			<div className="w-full mx-auto grow h-full overflow-hidden">
				<div className="w-full h-full relative">
					<AnimatePresence mode="wait">
						{showMessageViewer ? (
							<motion.div
								key="message-viewer"
								initial={false}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: "100%", opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="absolute inset-0 w-full h-full"
							>
								{/*  TODO: add ChatContextProvider here */}
								<ChatContextProvider
									icons={undefined}
									labels={undefined}
									open={true}
									setOpen={() => {}}
								>
									<MessageViewer
										messages={visibleMessages}
										inProgress={isLoading}
										onRegenerate={handleRegenerate}
										onCopy={handleCopy}
										// onThumbsUp={onThumbsUp}
										// onThumbsDown={onThumbsDown}
										// markdownTagRenderers={markdownTagRenderers}
									>
										{currentSuggestions.length > 0 && (
											<Suggestions
												onSuggestionClick={handleSendMessage}
												suggestions={currentSuggestions}
											/>
										)}
									</MessageViewer>
								</ChatContextProvider>
							</motion.div>
						) : (
							<motion.div
								key="dashboard-children"
								initial={false}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: -50, opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="w-full px-5 max-w-5xl mx-auto h-full"
							>
								{children}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			<ChatInterface placeholder="What do you want to do today?" />
		</div>
	);
}
