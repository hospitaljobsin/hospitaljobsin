"use client";
import PrivacySettingsViewSkeleton from "@/components/settings/privacy/PrivacySettingsViewSkeleton";
import dynamic from "next/dynamic";

const PrivacyClientComponent = dynamic(
	() => import("./PrivacyClientComponent"),
	{
		ssr: false,
		loading: () => <PrivacySettingsViewSkeleton />,
	},
);

export default function PrivacySettingsPage() {
	return <PrivacyClientComponent />;
}
