import { Button } from "@heroui/react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { TwoFactorAuthenticationFragment$key } from "./__generated__/TwoFactorAuthenticationFragment.graphql";

const TwoFactorAuthenticationFragment = graphql`
  fragment TwoFactorAuthenticationFragment on Account {
    has2fa
  }
`;

export default function TwoFactorAuthentication({
	rootQuery,
}: { rootQuery: TwoFactorAuthenticationFragment$key }) {
	const data = useFragment(TwoFactorAuthenticationFragment, rootQuery);
	return (
		<div className="w-full flex flex-col gap-6">
			<h2 className="text-md font-medium text-foreground-500">
				Two Factor Authentication
			</h2>
			<p className="text-foreground-400">
				Two-factor authentication (2FA) is an essential security measure that
				adds an extra layer of protection to your online accounts.{" "}
			</p>
			{data.has2fa ? (
				<p>you have 2fa</p>
			) : (
				<Button fullWidth>Enable 2FA</Button>
			)}
		</div>
	);
}
