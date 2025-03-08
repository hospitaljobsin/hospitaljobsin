import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { dateFormat, getRelativeTimeString } from "@/lib/intl";
import {
	Button,
	Card,
	CardFooter,
	CardHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import { Edit2, Fingerprint, Trash } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DeletePasskeyModal from "./DeletePasskeyModal";
import UpdatePasskeyModal from "./UpdatePasskeyModal";
import type { PasskeyAccountMetadataFragment$key } from "./__generated__/PasskeyAccountMetadataFragment.graphql";
import type { PasskeyFragment$key } from "./__generated__/PasskeyFragment.graphql";

export const PasskeyFragment = graphql`
  fragment PasskeyFragment on WebAuthnCredential {
	id
	nickname
    createdAt
	lastUsedAt
	...UpdatePasskeyModalFragment
	...DeletePasskeyModalFragment
  }
`;

export const PasskeyAccountMetadataFragment = graphql`
  fragment PasskeyAccountMetadataFragment on Account {
	sudoModeExpiresAt
	authProviders
  }
`;

type Props = {
	passkey: PasskeyFragment$key;
	account: PasskeyAccountMetadataFragment$key;
	passkeysConnectionId: string;
};

export default function Passkey({
	passkey,
	passkeysConnectionId,
	account,
	totalPasskeys,
}: Props & { totalPasskeys: number }) {
	const data = useFragment(PasskeyFragment, passkey);
	const accountData = useFragment(PasskeyAccountMetadataFragment, account);

	const isOnlyWebAuthn =
		accountData.authProviders.length === 1 &&
		accountData.authProviders[0] === "WEBAUTHN_CREDENTIAL";
	const isLastPasskey = totalPasskeys === 1;
	const canDelete = !(isOnlyWebAuthn && isLastPasskey);

	const { checkSudoMode } = useCheckSudoMode();

	const {
		onOpen: onUpdatePasskeyModalOpen,
		onOpenChange: onUpdatePasskeyModalOpenChange,
		onClose: onUpdatePasskeyModalClose,
		isOpen: isUpdatePasskeyModalOpen,
	} = useDisclosure();

	const {
		onOpen: onDeletePasskeyModalOpen,
		onOpenChange: onDeletePasskeyModalOpenChange,
		onClose: onDeletePasskeyModalClose,
		isOpen: isDeletePasskeyModalOpen,
	} = useDisclosure();

	async function handlePasskeyDeleteModalOpen() {
		if (checkSudoMode(accountData.sudoModeExpiresAt)) {
			onDeletePasskeyModalOpen();
		}
	}

	return (
		<>
			<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
				<CardHeader className="w-full flex-col sm:flex-row flex justify-between items-start gap-6">
					<div className="flex gap-4 items-center">
						<Fingerprint size={24} />
						<h2 className="text-md sm:text-lg">{data.nickname}</h2>
					</div>
					<div className="flex items-center gap-4">
						<Tooltip content="Update passkey">
							<Button
								isIconOnly
								variant="light"
								color="default"
								onPress={onUpdatePasskeyModalOpen}
							>
								<Edit2 size={20} />
							</Button>
						</Tooltip>
						<Tooltip
							content={
								canDelete ? (
									"Delete passkey"
								) : (
									<div className="max-w-64 flex flex-col gap-2">
										<p className="text-balance text-center">
											Cannot delete this passkey, add more authentication
											methods first
										</p>
									</div>
								)
							}
						>
							<Button
								isIconOnly
								variant="light"
								color="danger"
								onPress={handlePasskeyDeleteModalOpen}
								isDisabled={!canDelete}
							>
								<Trash size={20} />
							</Button>
						</Tooltip>
					</div>
				</CardHeader>

				<CardFooter className="w-full flex justify-end sm:justify-start gap-8">
					<p className="text-foreground-400 text-sm">
						Created on {dateFormat.format(new Date(data.createdAt))}
					</p>
					<p className="text-foreground-400 text-sm">
						Last used {getRelativeTimeString(new Date(data.lastUsedAt))}
					</p>
				</CardFooter>
			</Card>
			<UpdatePasskeyModal
				isOpen={isUpdatePasskeyModalOpen}
				onClose={onUpdatePasskeyModalClose}
				onOpenChange={onUpdatePasskeyModalOpenChange}
				passkey={data}
			/>
			<DeletePasskeyModal
				isOpen={isDeletePasskeyModalOpen}
				onOpenChange={onDeletePasskeyModalOpenChange}
				onClose={onDeletePasskeyModalClose}
				passkey={data}
				passkeysConnectionId={passkeysConnectionId}
			/>
		</>
	);
}
