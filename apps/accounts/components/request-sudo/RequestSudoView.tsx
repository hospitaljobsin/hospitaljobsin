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
import type { RequestSudoViewFragment$key } from "./__generated__/RequestSudoViewFragment.graphql";

const RequestSudoViewFragment = graphql`
 fragment RequestSudoViewFragment on Query {
	viewer {
		__typename
		... on Account {
			authProviders
		}
	}
  }
`;

export default function RequestSudoView({
	rootQuery,
}: { rootQuery: RequestSudoViewFragment$key }) {
	const searchParams = useSearchParams();
	const router = useRouter();

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

	// Only show Google OAuth if no other auth methods are available
	const showGoogleOAuth = hasOauthGoogle && !hasPassword && !hasWebauthn;

	// Calculate if we need dividers (only between password and webauthn)
	const showDivider = hasPassword && hasWebauthn;

	function getOauth2ErrorMessage(errorCode: string): string {
		switch (errorCode) {
			case "invalid_account":
				return "Invalid Oauth2 account selected. Please select the account associated with your email address.";
			default:
				return "An error occurred. Please try again.";
		}
	}

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
				<CardHeader className="flex flex-col gap-6">
					<h2 className="text-lg sm:text-xl font-medium text-center w-full">
						Please authenticate to continue
					</h2>
					<p className="w-full text-balance text-center text-foreground-500 text-small sm:text-base">
						You are entering <i>sudo mode,</i> which is needed to perform
						sensitive operations. You won't be asked to authenticate again for a
						while.
					</p>
				</CardHeader>
				<CardBody className="max-w-lg w-full flex flex-col gap-12 pt-12 mx-auto">
					{hasPassword && (
						<PasswordAuthentication
							isDisabled={isAuthenticating}
							onAuthStart={() => setIsAuthenticating(true)}
							onAuthEnd={() => setIsAuthenticating(false)}
						/>
					)}
					{showDivider && (
						<div className="w-full flex items-center justify-center gap-6">
							<Divider className="flex-1" />
							<p>or</p>
							<Divider className="flex-1" />
						</div>
					)}
					{hasWebauthn && (
						<PasskeyAuthentication
							isDisabled={isAuthenticating}
							onAuthStart={() => setIsAuthenticating(true)}
							onAuthEnd={() => setIsAuthenticating(false)}
						/>
					)}
					{showGoogleOAuth && (
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
					)}
				</CardBody>
				<CardFooter className="w-full flex items-center justify-center gap-6 pt-12 max-w-lg mx-auto">
					<Button
						fullWidth
						as={Link}
						href={redirectTo}
						variant="bordered"
						color="default"
					>
						go back
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
