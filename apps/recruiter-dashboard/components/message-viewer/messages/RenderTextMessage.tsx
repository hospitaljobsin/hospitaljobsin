import type { RenderMessageProps } from "../props";
import { AssistantMessage as DefaultAssistantMessage } from "./AssistantMessage";
import { UserMessage as DefaultUserMessage } from "./UserMessage";

export function RenderTextMessage({
	UserMessage = DefaultUserMessage,
	AssistantMessage = DefaultAssistantMessage,
	...props
}: RenderMessageProps) {
	const {
		message,
		inProgress,
		index,
		isCurrentMessage,
		onRegenerate,
		onCopy,
		onThumbsUp,
		onThumbsDown,
		markdownTagRenderers,
	} = props;

	if (message.isTextMessage()) {
		if (message.role === "user") {
			return (
				<UserMessage
					key={index}
					data-message-role="user"
					message={message.content}
					rawData={message}
				/>
			);
		}
		if (message.role === "assistant") {
			return (
				<AssistantMessage
					key={index}
					data-message-role="assistant"
					message={message.content}
					rawData={message}
					isLoading={inProgress && isCurrentMessage && !message.content}
					isGenerating={inProgress && isCurrentMessage && !!message.content}
					isCurrentMessage={isCurrentMessage}
					onRegenerate={() => onRegenerate?.(message.id)}
					onCopy={onCopy}
					onThumbsUp={onThumbsUp}
					onThumbsDown={onThumbsDown}
					markdownTagRenderers={markdownTagRenderers}
				/>
			);
		}
	}
}
