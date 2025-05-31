"use client";

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4-mini";

const chatSchema = z.object({
	message: z.string().check(z.minLength(1)),
});

export default function ChatInterface({
	placeholder,
}: { placeholder: string }) {
	const {
		visibleMessages,
		appendMessage,
		setMessages,
		deleteMessage,
		reloadMessages,
		stopGeneration,
		isLoading,
	} = useCopilotChat();

	// TODO: get a showMessages variable from a context (provider) and conditionally show the messages screen here

	const form = useForm<z.infer<typeof chatSchema>>({
		resolver: standardSchemaResolver(chatSchema),
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = (data: z.infer<typeof chatSchema>) => {
		appendMessage(new TextMessage({ content: data.message, role: Role.User }));
		form.reset();
	};

	return (
		<div className="w-full mx-auto bg-background-400">
			<div className="w-full bg-background-400 bottom-0 fixed p-8 px-5">
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto max-w-5xl"
				>
					<Input
						fullWidth
						variant="faded"
						startContent={
							<Sparkles size={20} className="text-foreground-400 mx-4" />
						}
						placeholder={placeholder}
						size="lg"
						{...form.register("message")}
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
