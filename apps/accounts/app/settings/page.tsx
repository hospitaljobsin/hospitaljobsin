"use client";
import AccountSettingsViewSkeleton from "@/components/settings/account/AccountSettingsViewSkeleton";
import dynamic from "next/dynamic";

const AccountClientComponent = dynamic(
	() => import("./AccountClientComponent"),
	{
		ssr: false,
		loading: () => <AccountSettingsViewSkeleton />,
	},
);

export default function AccountSettingsPage() {
	return <AccountClientComponent />;
}
