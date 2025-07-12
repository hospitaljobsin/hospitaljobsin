"use client";

import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";

const OrganizationMemberSettingsClientComponent = dynamic(
	() => import("./OrganizationMemberSettingsClientComponent"),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner size="lg" />
			</div>
		),
	},
);

export default function OrganizationMemberSettingsPage() {
	return <OrganizationMemberSettingsClientComponent />;
}
