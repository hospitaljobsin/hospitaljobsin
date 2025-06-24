import type { RenderFunctionStatus } from "@copilotkit/react-core";
import { useCopilotContext } from "@copilotkit/react-core";
import { MessageStatusCode } from "@copilotkit/runtime-client-gql";
import type { RenderMessageProps } from "../props";
import { AssistantMessage as DefaultAssistantMessage } from "./AssistantMessage";

export function RenderActionExecutionMessage({
	AssistantMessage = DefaultAssistantMessage,
	...props
}: RenderMessageProps) {
	const { chatComponentsCache } = useCopilotContext();
	const { message, inProgress, index, isCurrentMessage, actionResult } = props;

	if (message.isActionExecutionMessage()) {
		if (
			chatComponentsCache.current !== null &&
			(chatComponentsCache.current.actions[message.name] ||
				chatComponentsCache.current.actions["*"])
		) {
			const render =
				chatComponentsCache.current.actions[message.name] ||
				chatComponentsCache.current.actions["*"];
			// render a static string
			if (typeof render === "string") {
				// when render is static, we show it only when in progress
				if (isCurrentMessage && inProgress) {
					return (
						<AssistantMessage
							rawData={message}
							key={index}
							data-message-role="assistant"
							isLoading={false}
							isGenerating={true}
							message={render}
						/>
					);
				}
				// Done - silent by default to avoid a series of "done" messages

				return null;
			}
			// render is a function

			const args = message.arguments;

			let status: RenderFunctionStatus = "inProgress";

			if (actionResult !== undefined) {
				status = "complete";
			} else if (message.status.code !== MessageStatusCode.Pending) {
				status = "executing";
			}

			try {
				const toRender = render({
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					status: status as any,
					args,
					result: actionResult,
					name: message.name,
				});
				// No result and complete: stay silent
				if (!toRender && status === "complete") {
					return null;
				}
				if (typeof toRender === "string") {
					return (
						<AssistantMessage
							rawData={message}
							data-message-role="assistant"
							key={index}
							isLoading={false}
							isGenerating={false}
							message={toRender}
						/>
					);
				}
				return (
					<AssistantMessage
						rawData={message}
						data-message-role="action-render"
						key={index}
						isLoading={false}
						isGenerating={false}
						subComponent={toRender}
					/>
				);
			} catch (e) {
				console.error(
					`Error executing render function for action ${message.name}: ${e}`,
				);
				return (
					<AssistantMessage
						rawData={message}
						data-message-role="assistant"
						key={index}
						isLoading={false}
						isGenerating={false}
						subComponent={
							<div className="copilotKitMessage copilotKitAssistantMessage">
								<b>
									❌ Error executing render function for action {message.name}:
								</b>
								<pre>{e instanceof Error ? e.message : String(e)}</pre>
							</div>
						}
					/>
				);
			}
		}
		// No render function found- show the default message
		else if (!inProgress || !isCurrentMessage) {
			// Done - silent by default to avoid a series of "done" messages
			return null;
		} else {
			// In progress
			return (
				<AssistantMessage
					rawData={message}
					key={index}
					data-message-role="assistant"
					isLoading={true}
					isGenerating={true}
				/>
			);
		}
	}
}
