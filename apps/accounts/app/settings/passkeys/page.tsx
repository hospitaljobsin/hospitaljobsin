"use client";
import PasskeysSettingsViewSkeleton from "@/components/settings/passkeys/PasskeysSettingsViewSkeleton";
import dynamic from "next/dynamic";

const PasskeysClientComponent = dynamic(
	() => import("./PasskeysClientComponent"),
	{
		ssr: false,
		loading: () => <PasskeysSettingsViewSkeleton />,
	},
);

export default function PasskeysSettingsPage() {
	return <PasskeysClientComponent />;
}
