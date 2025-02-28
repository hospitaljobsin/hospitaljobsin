import { dateFormat } from "@/lib/intl";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Tooltip,
} from "@heroui/react";
import {
	Laptop2,
	Smartphone,
	TabletIcon,
	Trash2,
	WatchIcon,
} from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { IDevice } from "ua-parser-js";
import { UAParser } from "ua-parser-js";
import type { SessionDeleteMutation } from "./__generated__/SessionDeleteMutation.graphql";
import type { SessionFragment$key } from "./__generated__/SessionFragment.graphql";

export const SessionFragment = graphql`
  fragment SessionFragment on Session {
	id
	userAgent
	ipAddress
    createdAt
    isCurrentSession
  }
`;

const DeleteSessionMutation = graphql`
  mutation SessionDeleteMutation($sessionId: ID!, $connections: [ID!]!) {
	deleteSession(sessionId: $sessionId) {
		... on DeleteSessionSuccess {
			sessionEdge {
			node {
				id @deleteEdge(connections: $connections)
			}
		}
	}
  }
}
`;

type Props = {
	session: SessionFragment$key;
	sessionsConnectionId: string;
};

function getSessionIcon(device: IDevice) {
	switch (device.type) {
		case "mobile":
			return <Smartphone size={24} />;
		case "tablet":
			return <TabletIcon size={24} />;
		case "wearable":
			return <WatchIcon size={24} />;
		default:
			return <Laptop2 size={24} />;
	}
}

export default function Session({ session, sessionsConnectionId }: Props) {
	const data = useFragment(SessionFragment, session);
	const { browser, device, os, engine } = UAParser(data.userAgent);

	const [commitDelete, isDeleteMutationInFlight] =
		useMutation<SessionDeleteMutation>(DeleteSessionMutation);

	async function handleSessionDelete() {
		commitDelete({
			variables: {
				sessionId: data.id,
				connections: [sessionsConnectionId],
			},
		});
	}

	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardHeader className="w-full flex justify-between gap-6">
				<div className="flex gap-4 items-center">
					{getSessionIcon(device)}
					<h2 className="text-lg">{data.ipAddress}</h2>
				</div>
				{data.isCurrentSession ? (
					<>
						<Chip
							variant="flat"
							color="success"
							size="sm"
							className="flex sm:hidden"
						>
							Current session
						</Chip>
						<Chip variant="flat" color="success" className="hidden sm:flex">
							Current session
						</Chip>
					</>
				) : (
					<div className="flex items-center">
						<Tooltip content="Delete session">
							<Button
								isIconOnly
								variant="light"
								color="danger"
								onPress={handleSessionDelete}
								isLoading={isDeleteMutationInFlight}
							>
								<Trash2 size={20} />
							</Button>
						</Tooltip>
					</div>
				)}
			</CardHeader>
			<CardBody>
				<p className="text-foreground-500">
					{browser.name} {browser.major}, {engine.name}, {os.name} {os.version}
				</p>
			</CardBody>
			<CardFooter>
				<p className="text-foreground-400 text-sm">
					Created on {dateFormat.format(new Date(data.createdAt))}
				</p>
			</CardFooter>
		</Card>
	);
}
