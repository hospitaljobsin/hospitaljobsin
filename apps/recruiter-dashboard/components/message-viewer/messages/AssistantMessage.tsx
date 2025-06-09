import type { TextMessage } from "@copilotkit/runtime-client-gql";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useChatContext } from "../ChatContext";
import { Markdown } from "../Markdown";
import type { AssistantMessageProps } from "../props";

export const AssistantMessage = (props: AssistantMessageProps) => {
	const { icons, labels } = useChatContext();
	const {
		message,
		isLoading,
		subComponent,
		onRegenerate,
		onCopy,
		onThumbsUp,
		onThumbsDown,
		isCurrentMessage,
		rawData,
		markdownTagRenderers,
	} = props;
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (message && onCopy) {
			navigator.clipboard.writeText(message);
			setCopied(true);
			onCopy(message);
			setTimeout(() => setCopied(false), 2000);
		} else if (message) {
			navigator.clipboard.writeText(message);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleRegenerate = () => {
		if (onRegenerate) {
			onRegenerate();
		}
	};

	const handleThumbsUp = () => {
		const fullMessage = rawData as TextMessage;
		if (onThumbsUp && fullMessage) {
			onThumbsUp(fullMessage);
		}
	};

	const handleThumbsDown = () => {
		const fullMessage = rawData as TextMessage;
		if (onThumbsDown && fullMessage) {
			onThumbsDown(fullMessage);
		}
	};

	const LoadingIcon = () => <span>{icons.activityIcon}</span>;

	return (
		<>
			{(message || isLoading) && (
				<div className="copilotKitMessage copilotKitAssistantMessage">
					{message && (
						<Markdown
							content={message || ""}
							components={markdownTagRenderers}
						/>
					)}
					{isLoading && <LoadingIcon />}

					{message && !isLoading && (
						<div
							className={`copilotKitMessageControls ${isCurrentMessage ? "currentMessage" : ""}`}
						>
							<Button
								isIconOnly
								className="copilotKitMessageControlButton"
								onPress={handleRegenerate}
								aria-label={labels.regenerateResponse}
								title={labels.regenerateResponse}
							>
								{icons.regenerateIcon}
							</Button>
							<Button
								isIconOnly
								className="copilotKitMessageControlButton"
								onPress={handleCopy}
								aria-label={labels.copyToClipboard}
								title={labels.copyToClipboard}
							>
								{copied ? (
									<span style={{ fontSize: "10px", fontWeight: "bold" }}>
										✓
									</span>
								) : (
									icons.copyIcon
								)}
							</Button>
							{onThumbsUp && (
								<Button
									isIconOnly
									className="copilotKitMessageControlButton"
									onPress={handleThumbsUp}
									aria-label={labels.thumbsUp}
									title={labels.thumbsUp}
								>
									{icons.thumbsUpIcon}
								</Button>
							)}
							{onThumbsDown && (
								<Button
									isIconOnly
									className="copilotKitMessageControlButton"
									onPress={handleThumbsDown}
									aria-label={labels.thumbsDown}
									title={labels.thumbsDown}
								>
									{icons.thumbsDownIcon}
								</Button>
							)}
						</div>
					)}
				</div>
			)}
			<div style={{ marginBottom: "0.5rem" }}>{subComponent}</div>
		</>
	);
};
