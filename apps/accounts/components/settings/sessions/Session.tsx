import type { SessionAccountSudoFragment$key } from "@/__generated__/SessionAccountSudoFragment.graphql";
import type { SessionFragment$key } from "@/__generated__/SessionFragment.graphql";
import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { dateFormat } from "@/lib/intl";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import {
	CpuIcon,
	Globe,
	Laptop2,
	Monitor,
	Smartphone,
	TabletIcon,
	Trash,
	WatchIcon,
} from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { IDevice } from "ua-parser-js";
import { UAParser } from "ua-parser-js";
import DeleteSessionModal from "./DeleteSessionModal";

export const SessionFragment = graphql`
  fragment SessionFragment on Session {
	id
	userAgent
	ipAddress
    createdAt
	...DeleteSessionModalFragment
  }
`;

export const SessionAccountSudoFragment = graphql`
  fragment SessionAccountSudoFragment on Account {
	sudoModeExpiresAt
  }
`;

type Props = {
	session: SessionFragment$key;
	sessionsConnectionId: string;
	account: SessionAccountSudoFragment$key;
	isCurrentSession: boolean;
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

export default function Session({
	session,
	sessionsConnectionId,
	account,
	isCurrentSession,
}: Props) {
	const { checkSudoMode } = useCheckSudoMode();
	const data = useFragment(SessionFragment, session);
	const accountData = useFragment(SessionAccountSudoFragment, account);
	const { browser, device, os, engine } = UAParser(data.userAgent);

	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	async function handleSessionDelete() {
		if (checkSudoMode(accountData.sudoModeExpiresAt)) {
			onOpen();
		}
	}

	return (
		<>
			<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
				<CardHeader className="w-full flex justify-between gap-6">
					<div className="flex gap-4 items-center">
						{getSessionIcon(device)}
						<h2 className="text-lg">{data.ipAddress}</h2>
					</div>
					{isCurrentSession ? (
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
									onPress={handleSessionDelete}
								>
									<Trash size={20} />
								</Button>
							</Tooltip>
						</div>
					)}
				</CardHeader>
				<CardBody>
					<div className="flex flex-col gap-6 sm:gap-8 sm:flex-row">
						{browser.name && (
							<div className="flex items-center gap-2 text-foreground-500">
								<Globe size={16} />
								<span>
									{browser.name} {browser.major}
								</span>
							</div>
						)}
						{engine.name && (
							<div className="flex items-center gap-2 text-foreground-500">
								<CpuIcon size={16} />
								<span>
									{engine.name} {engine.version}
								</span>
							</div>
						)}
						{os.name && (
							<div className="flex items-center gap-2 text-foreground-500">
								<Monitor size={16} />
								<span>
									{os.name} {os.version}
								</span>
							</div>
						)}
					</div>
				</CardBody>
				<CardFooter className="w-full flex justify-end sm:justify-start">
					<p className="text-foreground-400 text-sm">
						Created on {dateFormat.format(new Date(data.createdAt))}
					</p>
				</CardFooter>
			</Card>
			<DeleteSessionModal
				isOpen={isOpen}
				onClose={onClose}
				onOpenChange={onOpenChange}
				session={data}
				sessionsConnectionId={sessionsConnectionId}
			/>
		</>
	);
}
