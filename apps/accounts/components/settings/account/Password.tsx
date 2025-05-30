import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import { Edit, TrashIcon } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { PasswordFragment$key } from "@/__generated__/PasswordFragment.graphql";
import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import DeletePasswordModal from "./DeletePasswordModal";
import UpdatePasswordModal from "./UpdatePasswordModal";

const PasswordFragment = graphql`
  fragment PasswordFragment on Account {
	sudoModeExpiresAt
    authProviders
    ...UpdatePasswordModalFragment
  }
`;

export default function Password({
	rootQuery,
}: {
	rootQuery: PasswordFragment$key;
}) {
	const data = useFragment(PasswordFragment, rootQuery);
	const {
		isOpen: isUpdatePasswordOpen,
		onOpenChange: onUpdatePasswordOpenChange,
		onOpen: onUpdatePasswordOpen,
		onClose: onUpdatePasswordClose,
	} = useDisclosure();
	const {
		isOpen: isDeletePasswordOpen,
		onOpenChange: onDeletePasswordOpenChange,
		onOpen: onDeletePasswordOpen,
		onClose: onDeletePasswordClose,
	} = useDisclosure();
	const { checkSudoMode } = useCheckSudoMode();

	function handleUpdatePasswordOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			onUpdatePasswordOpen();
		}
	}

	function handleDeletePasswordOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			onDeletePasswordOpen();
		}
	}
	const canDeletePassword = data.authProviders.length > 1;

	return (
		<>
			<Card className="p-4 sm:p-6" shadow="none">
				<CardHeader className="flex flex-col gap-4 items-start">
					<h2 className="text-md font-medium text-foreground-500">
						Password Settings
					</h2>
				</CardHeader>
				<CardBody>
					<div className="w-full flex flex-col gap-12">
						{data.authProviders.includes("PASSWORD") ? (
							<div className="w-full flex flex-col sm:flex-row gap-6">
								<Button
									onPress={handleUpdatePasswordOpen}
									fullWidth
									startContent={<Edit size={16} />}
								>
									Update password
								</Button>
								{canDeletePassword ? (
									<Button
										startContent={<TrashIcon size={16} />}
										onPress={handleDeletePasswordOpen}
										variant="bordered"
										fullWidth
									>
										Delete password
									</Button>
								) : (
									<Tooltip
										showArrow
										content={
											<div className="px-1 py-2 text-center text-tiny max-w-72">
												Set up a passkey or connect your Google account before
												deleting your password.
											</div>
										}
									>
										<span className="w-full">
											<Button
												startContent={<TrashIcon size={16} />}
												onPress={handleDeletePasswordOpen}
												isDisabled
												variant="bordered"
												fullWidth
											>
												Delete password
											</Button>
										</span>
									</Tooltip>
								)}
							</div>
						) : (
							<>
								<Button
									onPress={handleUpdatePasswordOpen}
									fullWidth
									startContent={<Edit size={16} />}
								>
									Set password
								</Button>
							</>
						)}
					</div>
				</CardBody>
			</Card>
			<UpdatePasswordModal
				isOpen={isUpdatePasswordOpen}
				onOpenChange={onUpdatePasswordOpenChange}
				onClose={onUpdatePasswordClose}
				account={data}
			/>
			<DeletePasswordModal
				isOpen={isDeletePasswordOpen}
				onOpenChange={onDeletePasswordOpenChange}
				onClose={onDeletePasswordClose}
			/>
		</>
	);
}
