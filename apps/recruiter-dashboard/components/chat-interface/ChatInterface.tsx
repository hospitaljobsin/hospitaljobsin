"use client";

import { useCopilotChatLogic } from "@/lib/hooks/useCopilotChatLogic";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { StopCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4-mini";
import MessageViewer from "./message-viewer/MessageViewer";

const chatSchema = z.object({
	message: z.string().check(z.minLength(1)),
});

export default function ChatInterface({
	placeholder,
	emptyMessagesPlaceholder,
}: {
	placeholder: string;
	emptyMessagesPlaceholder: ReactNode;
}) {
	const { visibleMessages, sendMessage, stopGeneration, isLoading } =
		useCopilotChatLogic();

	const form = useForm<z.infer<typeof chatSchema>>({
		resolver: standardSchemaResolver(chatSchema),
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof chatSchema>) => {
		await sendMessage(data.message);
		form.reset();
	};

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex-1 min-h-0 overflow-y-auto">
				<MessageViewer messages={visibleMessages} inProgress={isLoading} />
			</div>
			<div className="w-full bg-background-400 py-6 px-5 border-t border-gray-300 sticky bottom-0">
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto max-w-5xl flex items-center gap-4"
				>
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
