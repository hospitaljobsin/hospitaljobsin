import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	useDisclosure,
} from "@heroui/react";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import DisableTwoFactorAuthenticationModal from "./DisableTwoFactorAuthenticationModal";
import EnableTwoFactorAuthenticationModal from "./EnableTwoFactorAuthenticationModal";
import RegenerateRecoveryCodesModal from "./RegenerateRecoveryCodesModal";
import type { TwoFactorAuthenticationFragment$key } from "./__generated__/TwoFactorAuthenticationFragment.graphql";
import type { TwoFactorAuthenticationGenerate2FAChallengeMutation } from "./__generated__/TwoFactorAuthenticationGenerate2FAChallengeMutation.graphql";

const TwoFactorAuthenticationFragment = graphql`
  fragment TwoFactorAuthenticationFragment on Account {
    has2faEnabled
	sudoModeExpiresAt
	twoFactorProviders
  }
`;

const Generate2FAChallengeMutation = graphql`
  mutation TwoFactorAuthenticationGenerate2FAChallengeMutation {
	generateAuthenticator2faChallenge {
		__typename
		... on GenerateAuthenticator2FAChallengeSuccess {
			otpUri
			secret
		}
	}
  }
`;

export default function TwoFactorAuthentication({
	rootQuery,
}: { rootQuery: TwoFactorAuthenticationFragment$key }) {
	const data = useFragment(TwoFactorAuthenticationFragment, rootQuery);
	const [commitMutation, isMutationInFlight] =
		useMutation<TwoFactorAuthenticationGenerate2FAChallengeMutation>(
			Generate2FAChallengeMutation,
		);
	const [otpUri, setOtpUri] = useState("");
	const [secret, setSecret] = useState("");
	const {
		isOpen: isEnableModalOpen,
		onOpenChange: onEnableModalOpenChange,
		onOpen: onEnableModalOpen,
		onClose: onEnableModalClose,
	} = useDisclosure();
	const {
		isOpen: isDisableModalOpen,
		onOpenChange: onDisableModalOpenChange,
		onOpen: onDisableModalOpen,
		onClose: onDisableModalClose,
	} = useDisclosure();
	const {
		isOpen: isRegenerateCodesModalOpen,
		onOpenChange: onRegenerateCodesModalOpenChange,
		onOpen: onRegenerateCodesModalOpen,
		onClose: onRegenerateCodesModalClose,
	} = useDisclosure();
	const { checkSudoMode } = useCheckSudoMode();

	function handleEnable2faOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			// Generate OTP URI here
			commitMutation({
				variables: {},
				onCompleted(response) {
					if (
						response.generateAuthenticator2faChallenge.__typename ===
						"GenerateAuthenticator2FAChallengeSuccess"
					) {
						setOtpUri(response.generateAuthenticator2faChallenge.otpUri);
						setSecret(response.generateAuthenticator2faChallenge.secret);
						onEnableModalOpen();
					}
				},
			});
		}
	}

	function handleDisable2faOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			onDisableModalOpen();
		}
	}

	function handleRegenerateRecoveryCodesOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			onRegenerateCodesModalOpen();
		}
	}
	return (
		<>
			<Card className="p-4 sm:p-6" shadow="none">
				<CardHeader className="flex flex-col gap-4 items-start">
					<h2 className="text-md font-medium text-foreground-500">
						Two Factor Authentication
					</h2>
					<p className="text-foreground-400">
						Two-factor authentication (2FA) is a recommended security measure
						that adds an extra layer of protection to your online accounts.{" "}
					</p>
				</CardHeader>
				<CardBody>
					<div className="w-full flex flex-col gap-12">
						<div className="w-full flex flex-col items-center gap-6">
							<div className="w-full flex flex-col sm:flex-row items-center gap-4 justify-between">
								<div className="flex flex-col gap-4">
									<h3>Authenticator App</h3>
									<p className="text-small text-foreground-400">
										Use an authentication app or browser extension to get
										two-factor authentication codes when prompted.
									</p>
								</div>
								{data.twoFactorProviders.includes("AUTHENTICATOR") ? (
									<Button
										variant="flat"
										className="w-full sm:w-auto"
										onPress={handleDisable2faOpen}
									>
										Disable
									</Button>
								) : (
									<Button
										className="w-full sm:w-auto"
										onPress={handleEnable2faOpen}
										isLoading={isMutationInFlight}
									>
										Enable
									</Button>
								)}
							</div>
						</div>
						{data.has2faEnabled && (
							<>
								<Divider />
								<Button
									fullWidth
									variant="bordered"
									startContent={<RotateCcw size={20} />}
									onPress={handleRegenerateRecoveryCodesOpen}
								>
									Regenerate Recovery Codes
								</Button>
							</>
						)}
					</div>
				</CardBody>
			</Card>
			<EnableTwoFactorAuthenticationModal
				isOpen={isEnableModalOpen}
				onOpenChange={onEnableModalOpenChange}
				onClose={onEnableModalClose}
				otpUri={otpUri}
				secret={secret}
			/>
			<DisableTwoFactorAuthenticationModal
				isOpen={isDisableModalOpen}
				onOpenChange={onDisableModalOpenChange}
				onClose={onDisableModalClose}
			/>
			<RegenerateRecoveryCodesModal
				isOpen={isRegenerateCodesModalOpen}
				onOpenChange={onRegenerateCodesModalOpenChange}
				onClose={onRegenerateCodesModalClose}
			/>
		</>
	);
}
