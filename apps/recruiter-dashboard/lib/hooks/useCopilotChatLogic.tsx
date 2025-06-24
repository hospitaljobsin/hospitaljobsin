import {
	type CopilotChatSuggestion,
	reloadSuggestions,
} from "@/components/chat-interface/message-viewer/Suggestion";
import {
	type HintFunction,
	type SystemMessageFunction,
	runAgent,
	stopAgent,
	useCopilotChat,
	useCopilotContext,
	useCopilotMessagesContext,
} from "@copilotkit/react-core";
import {
	ImageMessage,
	type Message,
	Role,
	TextMessage,
} from "@copilotkit/runtime-client-gql";
import { randomId } from "@copilotkit/shared";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS_DEBOUNCE_TIMEOUT = 1000;

interface OnStopGenerationArguments {
	/**
	 * The name of the currently executing agent.
	 */
	currentAgentName: string | undefined;

	/**
	 * The messages in the chat.
	 */
	messages: Message[];

	/**
	 * Set the messages in the chat.
	 */
	setMessages: (messages: Message[]) => void;

	/**
	 * Stop chat generation.
	 */
	stopGeneration: () => void;

	/**
	 * Restart the currently executing agent.
	 */
	restartCurrentAgent: () => void;

	/**
	 * Stop the currently executing agent.
	 */
	stopCurrentAgent: () => void;

	/**
	 * Run the currently executing agent.
	 */
	runCurrentAgent: (hint?: HintFunction) => Promise<void>;

	/**
	 * Set the state of the currently executing agent.
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	setCurrentAgentState: (state: any) => void;
}

export type OnReloadMessagesArguments = OnStopGenerationArguments & {
	/**
	 * The message on which "regenerate" was pressed
	 */
	messageId: string;
};

export type OnStopGeneration = (args: OnStopGenerationArguments) => void;

export type OnReloadMessages = (args: OnReloadMessagesArguments) => void;

export const useCopilotChatLogic = (
	makeSystemMessage?: SystemMessageFunction,
	onInProgress?: (isLoading: boolean) => void,
	onSubmitMessage?: (messageContent: string) => Promise<void> | void,
	onStopGeneration?: OnStopGeneration,
	onReloadMessages?: OnReloadMessages,
) => {
	const {
		visibleMessages,
		appendMessage,
		reloadMessages: defaultReloadMessages,
		stopGeneration: defaultStopGeneration,
		runChatCompletion,
		isLoading,
	} = useCopilotChat({
		id: randomId(),
		makeSystemMessage,
	});

	const [currentSuggestions, setCurrentSuggestions] = useState<
		CopilotChatSuggestion[]
	>([]);
	const suggestionsAbortControllerRef = useRef<AbortController | null>(null);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const debounceTimerRef = useRef<any>(null);

	const abortSuggestions = () => {
		suggestionsAbortControllerRef.current?.abort();
		suggestionsAbortControllerRef.current = null;
	};

	const generalContext = useCopilotContext();
	const messagesContext = useCopilotMessagesContext();
	const context = { ...generalContext, ...messagesContext };

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		onInProgress?.(isLoading);

		abortSuggestions();

		debounceTimerRef.current = setTimeout(
			() => {
				if (
					!isLoading &&
					Object.keys(context.chatSuggestionConfiguration).length !== 0
				) {
					suggestionsAbortControllerRef.current = new AbortController();
					reloadSuggestions(
						context,
						context.chatSuggestionConfiguration,
						setCurrentSuggestions,
						suggestionsAbortControllerRef,
					);
				}
			},
			currentSuggestions.length === 0 ? 0 : SUGGESTIONS_DEBOUNCE_TIMEOUT,
		);

		return () => {
			clearTimeout(debounceTimerRef.current);
		};
	}, [
		isLoading,
		context.chatSuggestionConfiguration,
		// hackish way to trigger suggestions reload on reset, but better than moving suggestions to the
		// global context
		visibleMessages.length === 0,
	]);

	const sendMessage = async (
		messageContent: string,
		imagesToUse?: Array<{ contentType: string; bytes: string }>,
	) => {
		// Use images passed in the call OR the ones from the state (passed via props)
		const images = imagesToUse || [];

		abortSuggestions();
		setCurrentSuggestions([]);

		let firstMessage: Message | null = null;

		// If there's text content, send a text message first
		if (messageContent.trim().length > 0) {
			const textMessage = new TextMessage({
				content: messageContent,
				role: Role.User,
			});

			if (onSubmitMessage) {
				try {
					// Call onSubmitMessage only with text, as image handling is internal right now
					await onSubmitMessage(messageContent);
				} catch (error) {
					console.error("Error in onSubmitMessage:", error);
				}
			}

			await appendMessage(textMessage, { followUp: images.length === 0 });

			if (!firstMessage) {
				firstMessage = textMessage;
			}
		}

		// Send image messages
		if (images.length > 0) {
			for (let i = 0; i < images.length; i++) {
				const imageMessage = new ImageMessage({
					format: images[i].contentType.replace("image/", ""),
					bytes: images[i].bytes,
					role: Role.User,
				});
				await appendMessage(imageMessage, {
					followUp: i === images.length - 1,
				});
				if (!firstMessage) {
					firstMessage = imageMessage;
				}
			}
		}

		if (!firstMessage) {
			// Should not happen if send button is properly disabled, but handle just in case
			return new TextMessage({ content: "", role: Role.User }); // Return a dummy message
		}

		// The hook implicitly triggers API call on appendMessage.
		// We return the first message sent (either text or first image)
		return firstMessage;
	};

	const messages = visibleMessages;
	const { setMessages } = messagesContext;
	const currentAgentName = generalContext.agentSession?.agentName;
	const restartCurrentAgent = async (hint?: HintFunction) => {
		if (generalContext.agentSession) {
			generalContext.setAgentSession({
				...generalContext.agentSession,
				nodeName: undefined,
				threadId: undefined,
			});
			generalContext.setCoagentStates((prevAgentStates) => {
				return {
					...prevAgentStates,
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					[generalContext.agentSession!.agentName]: {
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						...prevAgentStates[generalContext.agentSession!.agentName],
						threadId: undefined,
						nodeName: undefined,
						runId: undefined,
					},
				};
			});
		}
	};
	const runCurrentAgent = async (hint?: HintFunction) => {
		if (generalContext.agentSession) {
			await runAgent(
				generalContext.agentSession.agentName,
				context,
				appendMessage,
				runChatCompletion,
				hint,
			);
		}
	};
	const stopCurrentAgent = () => {
		if (generalContext.agentSession) {
			stopAgent(generalContext.agentSession.agentName, context);
		}
	};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const setCurrentAgentState = (state: any) => {
		if (generalContext.agentSession) {
			generalContext.setCoagentStates((prevAgentStates) => {
				return {
					...prevAgentStates,
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					[generalContext.agentSession!.agentName]: {
						state,
					},
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				} as any;
			});
		}
	};

	function stopGeneration() {
		if (onStopGeneration) {
			onStopGeneration({
				messages,
				setMessages,
				stopGeneration: defaultStopGeneration,
				currentAgentName,
				restartCurrentAgent,
				stopCurrentAgent,
				runCurrentAgent,
				setCurrentAgentState,
			});
		} else {
			defaultStopGeneration();
		}
	}
	function reloadMessages(messageId: string) {
		if (onReloadMessages) {
			onReloadMessages({
				messages,
				setMessages,
				stopGeneration: defaultStopGeneration,
				currentAgentName,
				restartCurrentAgent,
				stopCurrentAgent,
				runCurrentAgent,
				setCurrentAgentState,
				messageId,
			});
		} else {
			defaultReloadMessages(messageId);
		}
	}

	return {
		visibleMessages,
		isLoading,
		currentSuggestions,
		sendMessage,
		stopGeneration,
		reloadMessages,
	};
};
