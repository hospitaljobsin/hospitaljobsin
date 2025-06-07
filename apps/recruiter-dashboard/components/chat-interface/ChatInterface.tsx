"use client";

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	ChevronLeft,
	ChevronRight,
	Sparkles,
	StopCircleIcon,
} from "lucide-react";
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

	const onSubmit = (data: z.infer<typeof chatSchema>) => {
		appendMessage(new TextMessage({ content: data.message, role: Role.User }));
		form.reset();
	};

	return (
		<div className="w-full mx-auto bottom-0 shrink sticky">
			<div className="w-full relative">
				<div className="absolute top-0 left-0 right-0 -mt-6 mx-auto max-w-5xl flex justify-start">
					<Button
						variant="shadow"
						isDisabled={isLoading}
						startContent={
							showMessageViewer ? (
								<ChevronLeft size={20} className="text-foreground-400" />
							) : (
								<ChevronRight size={20} className="text-foreground-400" />
							)
						}
						onPress={() => {
							setShowMessageViewer((status) => !status);
						}}
					>
						{showMessageViewer ? (
							<p>back to dashboard</p>
						) : (
							<p>view messages</p>
						)}
					</Button>
				</div>
			</div>

			<div className="w-full bg-background-400 p-8 px-5 border-t border-gray-300">
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
