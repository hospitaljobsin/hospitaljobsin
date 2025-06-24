import useScrollToBottom from "@/lib/hooks/useScrollToBottom";
import {
	useLangGraphInterrupt,
	useLangGraphInterruptRender,
} from "@copilotkit/react-core";
import {
	type Message,
	ResultMessage,
	Role,
	TextMessage,
} from "@copilotkit/runtime-client-gql";
import { AssistantMessage } from "./messages/AssistantMessage";
import { RenderActionExecutionMessage } from "./messages/RenderActionExecutionMessage";
import { RenderAgentStateMessage } from "./messages/RenderAgentStateMessage";
import { RenderImageMessage } from "./messages/RenderImageMessage";
import { RenderResultMessage } from "./messages/RenderResultMessage";
import { RenderTextMessage } from "./messages/RenderTextMessage";
import { UserMessage } from "./messages/UserMessage";
import type { MessagesProps } from "./props";

export default function MessageViewer({
	messages,
	inProgress,
	children,
	onRegenerate,
	onCopy,
	onThumbsUp,
	onThumbsDown,
	markdownTagRenderers,
}: MessagesProps) {
	const initialMessages = makeInitialMessages("");

	messages = [...initialMessages, ...messages];

	const actionResults: Record<string, string> = {};

	for (let i = 0; i < messages.length; i++) {
		if (messages[i].isActionExecutionMessage()) {
			const id = messages[i].id;
			const resultMessage: ResultMessage | undefined = messages.find(
				(message) =>
					message.isResultMessage() && message.actionExecutionId === id,
			) as ResultMessage | undefined;

			if (resultMessage) {
				actionResults[id] = ResultMessage.decodeResult(
					resultMessage.result || "",
				);
			}
		}
	}

	// TODO: remove these LangGraph interrupts, we are transitioning to AG-UI

	useLangGraphInterrupt({
		render: ({ event, resolve }) => (
			<div>
				<p>{event.value}</p>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						resolve((e.target as HTMLFormElement).response.value);
					}}
				>
					<input
						type="text"
						name="response"
						placeholder="Enter your response"
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		),
	});

	const { messagesContainerRef, messagesEndRef } = useScrollToBottom(messages);

	// TODO: remove these LangGraph interrupts, we are transitioning to AG-UI
	const interrupt = useLangGraphInterruptRender();

	if (messages.length === 0) {
		return (
			<div
				ref={messagesContainerRef}
				className="w-full max-w-5xl mx-auto h-full flex flex-col items-center justify-center gap-8 pb-16 overflow-y-auto flex-1"
			>
				no messages
			</div>
		);
	}

	return (
		<div
			ref={messagesContainerRef}
			className="w-full px-5 max-w-5xl mx-auto h-full flex flex-col gap-12 py-8 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-w-2.5 scrollbar-thumb-[hsl(var(--heroui-foreground-300))] scrollbar-track-transparent"
		>
			{messages.map((message, index) => {
				const isCurrentMessage = index === messages.length - 1;

				if (message.isTextMessage()) {
					return (
						<RenderTextMessage
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							message={message}
							inProgress={inProgress}
							index={index}
							isCurrentMessage={isCurrentMessage}
							AssistantMessage={AssistantMessage}
							UserMessage={UserMessage}
							onRegenerate={onRegenerate}
							onCopy={onCopy}
							onThumbsUp={onThumbsUp}
							onThumbsDown={onThumbsDown}
							markdownTagRenderers={markdownTagRenderers}
						/>
					);
				}
				if (message.isActionExecutionMessage()) {
					return (
						<RenderActionExecutionMessage
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							message={message}
							inProgress={inProgress}
							index={index}
							isCurrentMessage={isCurrentMessage}
							actionResult={actionResults[message.id]}
							AssistantMessage={AssistantMessage}
							UserMessage={UserMessage}
						/>
					);
				}
				if (message.isAgentStateMessage()) {
					return (
						<RenderAgentStateMessage
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							message={message}
							inProgress={inProgress}
							index={index}
							isCurrentMessage={isCurrentMessage}
							AssistantMessage={AssistantMessage}
							UserMessage={UserMessage}
						/>
					);
				}
				if (message.isResultMessage()) {
					return (
						<RenderResultMessage
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							message={message}
							inProgress={inProgress}
							index={index}
							isCurrentMessage={isCurrentMessage}
							AssistantMessage={AssistantMessage}
							UserMessage={UserMessage}
						/>
					);
				}
				if (message.isImageMessage?.()) {
					return (
						<RenderImageMessage
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							message={message}
							inProgress={inProgress}
							index={index}
							isCurrentMessage={isCurrentMessage}
							AssistantMessage={AssistantMessage}
							UserMessage={UserMessage}
							onRegenerate={onRegenerate}
							onCopy={onCopy}
							onThumbsUp={onThumbsUp}
							onThumbsDown={onThumbsDown}
						/>
					);
				}
			})}
			{interrupt}
			<footer className="flex p-0 mt-0 mb-2 mx-auto" ref={messagesEndRef}>
				{children}
			</footer>
		</div>
	);
}

function makeInitialMessages(initial?: string | string[]): Message[] {
	const initialArray: string[] = [];
	if (initial) {
		if (Array.isArray(initial)) {
			initialArray.push(...initial);
		} else {
			initialArray.push(initial);
		}
	}

	return initialArray.map(
		(message) =>
			new TextMessage({
				role: Role.Assistant,
				content: message,
			}),
	);
}
