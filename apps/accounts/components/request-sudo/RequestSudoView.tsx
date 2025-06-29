"use client";

import type {
	AuthProvider,
	RequestSudoViewFragment$key,
	TwoFactorProvider,
} from "@/__generated__/RequestSudoViewFragment.graphql";
import { env } from "@/lib/env/client";
import { useRouter } from "@bprogress/next";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
} from "@heroui/react";
import { Google } from "@lobehub/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import { getValidSudoModeRedirectURL } from "../../lib/redirects";
import PasskeyAuthentication from "./PasskeyAuthentication";
import PasswordAuthentication from "./PasswordAuthentication";
import TwoFactorAuthentication from "./TwoFactorAuthentication";

const RequestSudoViewFragment = graphql`
 fragment RequestSudoViewFragment on Query {
	viewer {
		__typename
		... on Account {
			authProviders
			twoFactorProviders
			has2faEnabled
		}
	}
  }
`;

const AUTH_METHOD_MESSAGES: Record<AuthProvider | TwoFactorProvider, string> = {
	PASSWORD: "Try using your password",
	WEBAUTHN_CREDENTIAL: "Try using your passkey",
	AUTHENTICATOR: "Try using your authenticator app",
	OAUTH_GOOGLE: "Try authenticating with Google",
	"%future added value": "Try another sign-in method",
};

function getDefaultAuthMethod(
	authProviders: readonly AuthProvider[],
	has2faEnabled: boolean,
	twoFactorProviders: readonly TwoFactorProvider[],
): AuthProvider | TwoFactorProvider {
	const hasPassword = authProviders.includes("PASSWORD");
	const hasPasskey = authProviders.includes("WEBAUTHN_CREDENTIAL");
	const hasOauthGoogle = authProviders.includes("OAUTH_GOOGLE");

	const hasAuthenticator =
		has2faEnabled && twoFactorProviders.includes("AUTHENTICATOR");

	// Only show Google OAuth if no other auth methods are available
	const showGoogleOAuth =
		hasOauthGoogle && !hasPassword && !hasPasskey && !hasAuthenticator;

	if (hasPasskey) {
		return "WEBAUTHN_CREDENTIAL";
	}
	if (hasPassword) {
		return "PASSWORD";
	}
	if (hasAuthenticator) {
		return "AUTHENTICATOR";
	}
	if (showGoogleOAuth) {
		return "OAUTH_GOOGLE";
	}
	return authProviders[0];
}

export default function RequestSudoView({
	rootQuery,
}: {
	rootQuery: RequestSudoViewFragment$key;
}) {
	const data = useFragment(RequestSudoViewFragment, rootQuery);

	invariant(data.viewer.__typename === "Account", "Account expected");
	const searchParams = useSearchParams();
	const router = useRouter();

	console.log(data.viewer.authProviders[0]);

	const oauth2Error = searchParams.get("oauth2_error");

	const [oauth2ErrorMessage, setOauth2ErrorMessage] = useState<null | string>(
		null,
	);

	const [isAuthenticating, setIsAuthenticating] = useState(false);

	useEffect(() => {
		if (oauth2Error !== null) {
			setOauth2ErrorMessage(oauth2Error);
			const url = new URL(window.location.href);
			url.searchParams.delete("oauth2_error");
			router.replace(url.toString(), { showProgress: false });
		}
	}, [oauth2Error, router]);

	const [currentAuthMethod, setCurrentAuthMethod] = useState<
		AuthProvider | TwoFactorProvider
	>(
		getDefaultAuthMethod(
			data.viewer.authProviders,
			data.viewer.has2faEnabled,
			data.viewer.twoFactorProviders,
		),
	);

	const redirectTo = getValidSudoModeRedirectURL(searchParams.get("return_to"));

	const hasPassword = data.viewer.authProviders.includes("PASSWORD");
	const hasPasskey = data.viewer.authProviders.includes("WEBAUTHN_CREDENTIAL");
	const hasOauthGoogle = data.viewer.authProviders.includes("OAUTH_GOOGLE");

	const hasAuthenticator =
		data.viewer.has2faEnabled &&
		data.viewer.twoFactorProviders.includes("AUTHENTICATOR");

	const showPassword = hasPassword && !data.viewer.has2faEnabled;

	// Only show Google OAuth if no other auth methods are available
	const showGoogleOAuth =
		hasOauthGoogle && !hasPassword && !hasPasskey && !hasAuthenticator;

	function getOauth2ErrorMessage(errorCode: string): string {
		switch (errorCode) {
			case "invalid_account":
				return "Invalid Oauth2 account selected. Please select the account associated with your email address.";
			case "2fa_required":
				return "Two-factor authentication is required to continue.";
			default:
				return "An error occurred. Please try again.";
		}
	}

	function getAvailableAuthMethods(): (AuthProvider | TwoFactorProvider)[] {
		const methods: (AuthProvider | TwoFactorProvider)[] = [];
		if (hasPasskey) methods.push("WEBAUTHN_CREDENTIAL");
		if (hasAuthenticator) methods.push("AUTHENTICATOR");
		if (showPassword) methods.push("PASSWORD");
		if (showGoogleOAuth) methods.push("OAUTH_GOOGLE");
		return methods;
	}

	const renderAuthMethod = () => {
		switch (currentAuthMethod) {
			case "PASSWORD":
				return showPassword ? (
					<PasswordAuthentication
						isDisabled={isAuthenticating}
						onAuthStart={() => setIsAuthenticating(true)}
						onAuthEnd={() => setIsAuthenticating(false)}
					/>
				) : null;
			case "WEBAUTHN_CREDENTIAL":
				return hasPasskey ? (
					<PasskeyAuthentication
						isDisabled={isAuthenticating}
						onAuthStart={() => setIsAuthenticating(true)}
						onAuthEnd={() => setIsAuthenticating(false)}
					/>
				) : null;
			case "AUTHENTICATOR":
				return hasAuthenticator ? (
					<TwoFactorAuthentication
						isDisabled={isAuthenticating}
						onAuthStart={() => setIsAuthenticating(true)}
						onAuthEnd={() => setIsAuthenticating(false)}
					/>
				) : null;
			case "OAUTH_GOOGLE":
				return showGoogleOAuth ? (
					<Button
						fullWidth
						variant="bordered"
						size="lg"
						startContent={<Google.Color size={20} />}
						onPress={() => {
							window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/request_sudo_mode/google?redirect_uri=${encodeURIComponent(`${env.NEXT_PUBLIC_URL}${redirectTo}`)}`;
						}}
					>
						Authenticate with Google
					</Button>
				) : null;
		}
	};

	const authMethods = getAvailableAuthMethods();

	return (
		<div className="w-full flex flex-col gap-6 h-full min-h-screen items-center justify-center">
			<Card className="p-6 sm:p-12 max-w-xl" isPressable={false} shadow="none">
				<Alert
					isVisible={oauth2ErrorMessage !== null}
					onClose={() => setOauth2ErrorMessage(null)}
					hideIcon
					description={getOauth2ErrorMessage(oauth2ErrorMessage || "")}
					color="danger"
					className="mb-4"
				/>
				<CardHeader className="flex flex-col gap-8">
					<h2 className="text-lg sm:text-xl font-medium text-center w-full">
						Please authenticate to continue
					</h2>
					<p className="w-full text-balance text-center text-foreground-400 text-tiny sm:text-base">
						You are entering <i>sudo mode,</i> which is needed to perform
						sensitive operations. You won't be asked to authenticate again for a
						while.
					</p>
				</CardHeader>
				<CardBody className="max-w-lg w-full flex flex-col gap-12 pt-12 mx-auto">
					{renderAuthMethod()}
				</CardBody>
				<CardFooter className="w-full flex flex-col items-center justify-center gap-6 pt-12 max-w-lg mx-auto">
					<Divider className="mb-6" />
					{authMethods.map(
						(method) =>
							method !== currentAuthMethod && (
								<Button
									key={method}
									variant="bordered"
									fullWidth
									onPress={() => setCurrentAuthMethod(method)}
									isDisabled={isAuthenticating}
								>
									{AUTH_METHOD_MESSAGES[method]}
								</Button>
							),
					)}
					<Button
						as={Link}
						href={redirectTo}
						variant="light"
						color="default"
						fullWidth
					>
						go back
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
