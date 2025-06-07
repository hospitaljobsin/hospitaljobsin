import { useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, MessageStatusCode } from "@copilotkit/runtime-client-gql";
import { Card, CardBody } from "@heroui/react";
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

	const messages = [
		{
			content: "Hello, how can I assist you today?",
			role: MessageRole.Assistant,
			id: "1",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "I need help with my job application.",
			role: MessageRole.User,
			id: "2",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "Sure! What specific help do you need?",
			role: MessageRole.Assistant,
			id: "3",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "I want to know the status of my application.",
			role: MessageRole.User,
			id: "4",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "Sure! What specific help do you need?",
			role: MessageRole.Assistant,
			id: "5",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "I want to know the status of my application.",
			role: MessageRole.User,
			id: "6",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "Sure! What specific help do you need?",
			role: MessageRole.Assistant,
			id: "7",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "I want to know the status of my application.",
			role: MessageRole.User,
			id: "8",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "Sure! What specific help do you need?",
			role: MessageRole.Assistant,
			id: "9",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
		{
			content: "I want to know the status of my application.",
			role: MessageRole.User,
			id: "10",
			createdAt: new Date().toISOString(),
			status: { code: MessageStatusCode.Success },
			type: "TextMessage",
			parentMessageId: null,
		},
	];

	if (messages.length === 0) {
		return (
			<motion.div
				key="message-viewer"
				initial={{ y: "100%", opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: "100%", opacity: 0 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="w-full max-w-5xl mx-auto h-full flex flex-col gap-8 pb-16 overflow-y-auto"
			>
				no messages
			</motion.div>
		);
	}

	return (
		<motion.div
			key="message-viewer"
			initial={{ y: "100%", opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: "100%", opacity: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="w-full px-2 max-w-5xl mx-auto h-full flex flex-col gap-8 pb-16 overflow-y-auto"
		>
			{messages.map((message) => {
				const isUser = message.role === MessageRole.User;
				return (
					<div
						key={message.id}
						className={`flex ${isUser ? "justify-end" : "justify-start"}`}
					>
						<Card
							shadow="none"
							className={`max-w-xs md:max-w-md xl:max-w-xl  ${
								isUser ? "ml-8 rounded-2xl  p-4" : "bg-transparent"
							}`}
						>
							<CardBody className="text-sm whitespace-pre-wrap">
								{message.content}
							</CardBody>
						</Card>
					</div>
				);
			})}
			{!isLoading && (
				<Card
					shadow="none"
					className="max-w-xs md:max-w-md xl:max-w-xl bg-transparent"
				>
					<CardBody className="text-sm">Loading...</CardBody>
				</Card>
			)}
		</motion.div>
	);
}
