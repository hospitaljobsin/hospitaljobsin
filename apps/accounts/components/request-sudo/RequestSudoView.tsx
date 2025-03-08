"use client";

import { env } from "@/lib/env";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Link,
} from "@heroui/react";
import { Google } from "@lobehub/icons";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import { getValidSudoModeRedirectURL } from "../../lib/redirects";
import PasskeyAuthentication from "./PasskeyAuthentication";
import PasswordAuthentication from "./PasswordAuthentication";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import type { RequestSudoViewFragment$key } from "./__generated__/RequestSudoViewFragment.graphql";

const RequestSudoViewFragment = graphql`
 fragment RequestSudoViewFragment on Query {
	viewer {
		__typename
		... on Account {
			authProviders
			has2faEnabled
		}
	}
  }
`;

type AuthMethod = "password" | "passkey" | "2fa" | "google";

const AUTH_METHOD_MESSAGES: Record<AuthMethod, string> = {
	password: "Try using your password",
	passkey: "Try using your passkey",
	"2fa": "Try using your authenticator app",
	google: "Try authenticating with Google",
};

export default function RequestSudoView({
	rootQuery,
}: { rootQuery: RequestSudoViewFragment$key }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [currentAuthMethod, setCurrentAuthMethod] =
		useState<AuthMethod>("password");

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
			router.replace(url.toString(), undefined, { showProgressBar: false });
		}
	}, [oauth2Error, router]);

	const redirectTo = getValidSudoModeRedirectURL(searchParams.get("return_to"));
	const data = useFragment(RequestSudoViewFragment, rootQuery);

	invariant(data.viewer.__typename === "Account", "Account expected");

	const hasPassword = data.viewer.authProviders.includes("PASSWORD");
	const hasWebauthn = data.viewer.authProviders.includes("WEBAUTHN_CREDENTIAL");
	const hasOauthGoogle = data.viewer.authProviders.includes("OAUTH_GOOGLE");

	const has2faEnabled = data.viewer.has2faEnabled;

	// Only show Google OAuth if no other auth methods are available
	const showGoogleOAuth =
		hasOauthGoogle && !hasPassword && !hasWebauthn && !has2faEnabled;

	function getOauth2ErrorMessage(errorCode: string): string {
		switch (errorCode) {
			case "invalid_account":
				return "Invalid Oauth2 account selected. Please select the account associated with your email address.";
			default:
				return "An error occurred. Please try again.";
		}
	}

	function getAvailableAuthMethods(): AuthMethod[] {
		const methods: AuthMethod[] = [];
		if (hasPassword) methods.push("password");
		if (hasWebauthn) methods.push("passkey");
		if (has2faEnabled) methods.push("2fa");
		if (showGoogleOAuth) methods.push("google");
		return methods;
	}

	const renderAuthMethod = () => {
		switch (currentAuthMethod) {
			case "password":
				return hasPassword ? (
					<PasswordAuthentication
						isDisabled={isAuthenticating}
						onAuthStart={() => setIsAuthenticating(true)}
						onAuthEnd={() => setIsAuthenticating(false)}
					/>
				) : null;
			case "passkey":
				return hasWebauthn ? (
					<PasskeyAuthentication
						isDisabled={isAuthenticating}
						onAuthStart={() => setIsAuthenticating(true)}
						onAuthEnd={() => setIsAuthenticating(false)}
					/>
				) : null;
			case "2fa":
				return has2faEnabled ? (
					<TwoFactorAuthentication
						isDisabled={isAuthenticating}
						onAuthStart={() => setIsAuthenticating(true)}
						onAuthEnd={() => setIsAuthenticating(false)}
					/>
				) : null;
			case "google":
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
