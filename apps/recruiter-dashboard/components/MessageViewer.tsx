import { useCopilotChat } from "@copilotkit/react-core";
import { motion } from "motion/react";
export default function MessageViewer() {
	const {
		visibleMessages,
		appendMessage,
		setMessages,
		deleteMessage,
		reloadMessages,
		stopGeneration,
		isLoading,
	} = useCopilotChat();

	return (
		<motion.div
			key="message-viewer"
			initial={{ y: "100%", opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: "100%", opacity: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="w-full flex flex-col gap-8 items-center justify-center h-full bg-background-800"
		>
			message viewer
		</motion.div>
	);
}
