"use client";

import { useCopilotChatLogic } from "@/lib/hooks/useCopilotChatLogic";
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
	const { visibleMessages, sendMessage, stopGeneration, isLoading } =
		useCopilotChatLogic();

	const form = useForm<z.infer<typeof chatSchema>>({
		resolver: standardSchemaResolver(chatSchema),
		defaultValues: {
			message: "",
		},
	});

	const isEmpty = visibleMessages.length === 0;

	const onSubmit = async (data: z.infer<typeof chatSchema>) => {
		setShowMessageViewer(true);
		await sendMessage(data.message);
		form.reset();
	};

	return (
		<div className="w-full mx-auto bottom-0 shrink sticky z-50">
			<div className="w-full bg-background-400 py-6 px-5 border-t border-gray-300">
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto max-w-5xl flex items-center gap-4"
				>
					<Button
						title={showMessageViewer ? "back to dashboard" : "view messages"}
						variant="faded"
						size="lg"
						isDisabled={isLoading || isEmpty}
						isIconOnly
						onPress={() => {
							setShowMessageViewer((status) => !status);
						}}
					>
						{showMessageViewer ? (
							<ChevronDown size={28} className="text-foreground-400" />
						) : (
							<ChevronUp size={28} className="text-foreground-400" />
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
