"use client";

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ChevronDown, ChevronUp, StopCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4-mini";
import { useMessageViewer } from "../MessageViewerProvider";

const chatSchema = z.object({
	message: z.string().check(z.minLength(1)),
});

export default function ChatInterface({
	placeholder,
}: { placeholder: string }) {
	const { setShowMessageViewer, showMessageViewer } = useMessageViewer();
	const {
		visibleMessages,
		appendMessage,
		setMessages,
		deleteMessage,
		reloadMessages,
		stopGeneration,
		isLoading,
	} = useCopilotChat();

	const form = useForm<z.infer<typeof chatSchema>>({
		resolver: standardSchemaResolver(chatSchema),
		defaultValues: {
			message: "",
		},
	});

	const isEmpty = visibleMessages.length === 0;

	const onSubmit = (data: z.infer<typeof chatSchema>) => {
		setShowMessageViewer(true);
		appendMessage(new TextMessage({ content: data.message, role: Role.User }));
		form.reset();
	};

	return (
		<div className="w-full mx-auto bottom-0 shrink sticky">
			<div className="w-full bg-background-400 p-6 px-5 border-t border-gray-300">
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto max-w-5xl flex items-center gap-4"
				>
					<Button
						title={showMessageViewer ? "back to dashboard" : "view messages"}
						variant="faded"
						isDisabled={isLoading || isEmpty}
						isIconOnly
						onPress={() => {
							setShowMessageViewer((status) => !status);
						}}
					>
						{showMessageViewer ? (
							<ChevronDown size={20} className="text-foreground-400" />
						) : (
							<ChevronUp size={20} className="text-foreground-400" />
						)}
					</Button>
					<Input
						fullWidth
						variant="faded"
						placeholder={placeholder}
						size="lg"
						{...form.register("message")}
						endContent={
							<Button
								type="button"
								variant="light"
								color="default"
								isIconOnly
								size="sm"
								onPress={stopGeneration}
								isDisabled={!isLoading}
							>
								<StopCircleIcon className="text-foreground-400" />
							</Button>
						}
					/>
					<input
						type="submit"
						hidden
						disabled={!form.formState.isValid || isLoading}
					/>
				</form>
			</div>
		</div>
	);
}
