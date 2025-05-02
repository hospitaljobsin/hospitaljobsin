"use client";
import type { SidebarJobSettingsQuery as SidebarJobSettingsQueryType } from "@/__generated__/SidebarJobSettingsQuery.graphql";
import SettingsSidebar, {
	SidebarJobSettingsQuery,
} from "@/components/job-detail/settings-tab/Sidebar";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { loadQuery } from "react-relay";

export default function JobSettingsLayout({
	children,
}: { children: React.ReactNode }) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);

	const queryReference = loadQuery<SidebarJobSettingsQueryType>(
		getCurrentEnvironment(),
		SidebarJobSettingsQuery,
		{
			slug: slug,
			jobSlug: jobSlug,
		},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<>
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-background-700" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
				<div className="relative w-full mx-auto max-w-5xl">
					<div className="flex flex-col md:flex-row min-h-screen bg-background-600">
						{/* Sidebar will now grow to fill the height */}
						<Suspense>
							<SettingsSidebar queryReference={queryReference} />
						</Suspense>
						<div className="flex-1 px-4 py-6 md:pl-12 bg-background-600">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
