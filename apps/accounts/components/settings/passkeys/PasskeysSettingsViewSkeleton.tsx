"use client";
import { Link } from "@heroui/react";
import { LEARN_MORE_ABOUT_PASSKEYS_LINK } from "@/lib/constants";
import PasskeysListSkeleton from "./PasskeysListSkeleton";

export default function PasskeysSettingsViewSkeleton() {
	return (
		<div className="w-full h-full space-y-12">
			<div className="w-full flex flex-col gap-4">
				<h2 className="text-lg">Passkeys</h2>
				<p className="text-foreground-400">
					Passkeys are webauthn credentials that validate your identity using
					touch, facial recognition, a device password, or a PIN.{" "}
					<Link isExternal showAnchorIcon href={LEARN_MORE_ABOUT_PASSKEYS_LINK}>
						Learn more about passkeys
					</Link>
				</p>
			</div>
			<PasskeysListSkeleton />
		</div>
	);
}
