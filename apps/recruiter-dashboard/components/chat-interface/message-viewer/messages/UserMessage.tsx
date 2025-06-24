import { Card, CardBody } from "@heroui/react";
import type { UserMessageProps } from "../props";

export const UserMessage = (props: UserMessageProps) => {
	return (
		<div className="flex justify-end w-full">
			<Card className="max-w-2xl min-w-xs" shadow="none">
				<CardBody>{props.subComponent || props.message}</CardBody>
			</Card>
		</div>
	);
};
