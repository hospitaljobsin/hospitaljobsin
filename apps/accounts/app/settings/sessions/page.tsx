"use client";
import SessionsSettingsViewSkeleton from "@/components/settings/sessions/SessionsSettingsViewSkeleton";
import dynamic from "next/dynamic";

const SessionsClientComponent = dynamic(
	() => import("./SessionsClientComponent"),
	{
		ssr: false,
		loading: () => <SessionsSettingsViewSkeleton />,
	},
);

export default function SessionsSettingsPage() {
	return <SessionsClientComponent />;
}
