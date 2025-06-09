import type { TextMessage } from "@copilotkit/runtime-client-gql";
import { Button, Spinner } from "@heroui/react";
import {
	CheckIcon,
	CopyIcon,
	RefreshCwIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
} from "lucide-react";
import { useState } from "react";
import { Markdown } from "../Markdown";
import type { AssistantMessageProps } from "../props";

export const AssistantMessage = (props: AssistantMessageProps) => {
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

	const LoadingIcon = () => (
		<span>
			<Spinner variant="wave" color="default" />
		</span>
	);

	return (
		<>
			<div className="w-full flex items-start">
				{(message || isLoading) && (
					<div className="flex flex-col gap-4 self-start max-w-2xl">
						{message && (
							<Markdown
								content={message || ""}
								components={markdownTagRenderers}
							/>
						)}
						{isLoading && <LoadingIcon />}

						{message && !isLoading && (
							<div
								className={`flex gap-4 items-center ${isCurrentMessage ? "currentMessage" : ""}`}
							>
								<Button
									isIconOnly
									onPress={handleRegenerate}
									aria-label="Regenerate response"
									title="Regenerate response"
									size="sm"
									variant="light"
									className="text-foreground-600"
								>
									<RefreshCwIcon size={14} />
								</Button>
								<Button
									isIconOnly
									onPress={handleCopy}
									aria-label="Copy to clipboard"
									title="Copy to clipboard"
									size="sm"
									variant="light"
									className="text-foreground-600"
								>
									{copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
								</Button>
								{onThumbsUp && (
									<Button
										isIconOnly
										onPress={handleThumbsUp}
										aria-label="Thumbs up"
										title="Thumbs up"
										size="sm"
										variant="light"
										className="text-foreground-600"
									>
										<ThumbsUpIcon size={14} />
									</Button>
								)}
								{onThumbsDown && (
									<Button
										isIconOnly
										onPress={handleThumbsDown}
										aria-label="Thumbs down"
										title="Thumbs down"
										size="sm"
										variant="light"
										className="text-foreground-600"
									>
										<ThumbsDownIcon size={14} />
									</Button>
								)}
							</div>
						)}
					</div>
				)}
				<div style={{ marginBottom: "0.5rem" }}>{subComponent}</div>
			</div>
		</>
	);
};
