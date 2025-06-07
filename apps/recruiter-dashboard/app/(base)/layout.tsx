"use client";

import MessageViewer from "@/components/MessageViewer";
import { useMessageViewer } from "@/components/MessageViewerProvider";
import ChatInterface from "@/components/chat-interface/ChatInterface";
import HeaderClientComponent from "@/components/layout/HeaderClientComponent";
import { AnimatePresence, motion } from "motion/react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showMessageViewer } = useMessageViewer();

	return (
		<div className="flex flex-col h-full w-full">
			<HeaderClientComponent />
			<div className="w-full mx-auto grow h-full overflow-hidden">
				<div className="w-full h-full relative">
					<AnimatePresence mode="wait">
						{showMessageViewer ? (
							<motion.div
								key="message-viewer"
								initial={{ y: "100%", opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: "100%", opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="absolute inset-0 w-full h-full"
							>
								<MessageViewer />
							</motion.div>
						) : (
							<motion.div
								key="dashboard-children"
								initial={{ y: -50, opacity: 0 }}
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
