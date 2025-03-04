import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import EnableTwoFactorAuthenticationModal from "./EnableTwoFactorAuthenticationModal";
import type { TwoFactorAuthenticationFragment$key } from "./__generated__/TwoFactorAuthenticationFragment.graphql";
import type { TwoFactorAuthenticationGenerateOTPURIMutation } from "./__generated__/TwoFactorAuthenticationGenerateOTPURIMutation.graphql";

const TwoFactorAuthenticationFragment = graphql`
  fragment TwoFactorAuthenticationFragment on Account {
    has2fa
	sudoModeExpiresAt
  }
`;

const GenerateOTPURIMutation = graphql`
  mutation TwoFactorAuthenticationGenerateOTPURIMutation {
	generateAccount2faOtpUri {
		__typename
		... on GenerateAccount2FAOTPURISuccess {
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
		useMutation<TwoFactorAuthenticationGenerateOTPURIMutation>(
			GenerateOTPURIMutation,
		);
	const [otpUri, setOtpUri] = useState("");
	const [secret, setSecret] = useState("");
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const { checkSudoMode } = useCheckSudoMode();

	function handle2faOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			// Generate OTP URI here
			commitMutation({
				variables: {},
				onCompleted(response) {
					if (
						response.generateAccount2faOtpUri.__typename ===
						"GenerateAccount2FAOTPURISuccess"
					) {
						setOtpUri(response.generateAccount2faOtpUri.otpUri);
						setSecret(response.generateAccount2faOtpUri.secret);
						onOpen();
					}
				},
			});
		}
	}
	return (
		<Card className="p-4 sm:p-6" shadow="none">
			<CardHeader className="flex flex-col gap-4 items-start">
				<h2 className="text-md font-medium text-foreground-500">
					Two Factor Authentication
				</h2>
				<p className="text-foreground-400">
					Two-factor authentication (2FA) is an essential security measure that
					adds an extra layer of protection to your online accounts.{" "}
				</p>
			</CardHeader>
			<CardBody>
				{data.has2fa ? (
					<p>you have 2fa</p>
				) : (
					<Button
						fullWidth
						onPress={handle2faOpen}
						isLoading={isMutationInFlight}
					>
						Enable 2FA
					</Button>
				)}
				<EnableTwoFactorAuthenticationModal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					otpUri={otpUri}
					secret={secret}
				/>
			</CardBody>
		</Card>
	);
}
