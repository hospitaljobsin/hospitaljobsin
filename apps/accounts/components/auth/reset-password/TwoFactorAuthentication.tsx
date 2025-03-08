import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import AuthenticatorTwoFactorAuthentication from "./AuthenticatorTwoFactorAuthentication";
import PasskeyTwoFactorAuthentication from "./PasskeyTwoFactorAuthentication";
import type {
	AuthProvider,
	TwoFactorAuthenticationResetPasswordFragment$key,
	TwoFactorProvider,
} from "./__generated__/TwoFactorAuthenticationResetPasswordFragment.graphql";

const TwoFactorAuthenticationResetPasswordFragment = graphql`
  fragment TwoFactorAuthenticationResetPasswordFragment on PasswordResetToken {
	twoFactorProviders
	authProviders
  }
  `;

export default function TwoFactorAuthentication({
	email,
	resetToken,
	onComplete,
	passwordResetToken,
}: {
	email: string;
	resetToken: string;
	onComplete: () => void;
	passwordResetToken: TwoFactorAuthenticationResetPasswordFragment$key;
}) {
	const data = useFragment(
		TwoFactorAuthenticationResetPasswordFragment,
		passwordResetToken,
	);
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [activeProvider, setActiveProvider] = useState<
		AuthProvider | TwoFactorProvider
	>(data.twoFactorProviders[0]);

	const showPasskey = data.authProviders.includes("WEBAUTHN_CREDENTIAL");

	const showAuthenticator = data.twoFactorProviders.includes("AUTHENTICATOR");

	return (
		<>
			{activeProvider === "WEBAUTHN_CREDENTIAL" && showPasskey && (
				<PasskeyTwoFactorAuthentication
					email={email}
					resetToken={resetToken}
					onComplete={onComplete}
					onAuthEnd={() => setIsAuthenticating(false)}
					onAuthStart={() => setIsAuthenticating(true)}
					isDisabled={isAuthenticating}
					hasAuthenticator={showAuthenticator}
					onSwitchToAuthenticator={() => setActiveProvider("AUTHENTICATOR")}
				/>
			)}
			{activeProvider === "AUTHENTICATOR" && showAuthenticator && (
				<AuthenticatorTwoFactorAuthentication
					email={email}
					resetToken={resetToken}
					onComplete={onComplete}
					onAuthEnd={() => setIsAuthenticating(false)}
					onAuthStart={() => setIsAuthenticating(true)}
					isDisabled={isAuthenticating}
					hasPasskey={showPasskey}
					onSwitchToPasskey={() => setActiveProvider("WEBAUTHN_CREDENTIAL")}
				/>
			)}
		</>
	);
}
