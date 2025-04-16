"use client";

import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { FileText, Settings } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function SettingsSidebar() {
	const pathname = usePathname();
	const params = useParams<{ slug: string; jobSlug: string }>();
	return (
		<>
			<div className="w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky top-0 self-stretch max-h-screen">
				<Tabs
					aria-label="Job Settings Navigation"
					isVertical
					variant="light"
					selectedKey={pathname}
					classNames={{
						tabWrapper: "w-full",
						base: "w-full",
						tabContent: "w-full",
						tabList: "w-full",
						panel: "h-full",
						tab: "py-5",
						cursor: "shadow-none"
					}}
				>
					<Tab
						key={links.jobDetailSettings(params.slug, params.jobSlug)}
						href={links.jobDetailSettings(params.slug, params.jobSlug)}
						title={
							<div className="flex items-center space-x-4">
								<Settings size={20} />
								<span>General</span>
							</div>
						}
					/>
					<Tab
						key={links.jobDetailSettingsApplicationForm(
							params.slug,
							params.jobSlug,
						)}
						href={links.jobDetailSettingsApplicationForm(
							params.slug,
							params.jobSlug,
						)}
						title={
							<div className="flex items-center space-x-4">
								<FileText size={20} />
								<span>Application Form</span>
							</div>
						}
					/>
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start">
				<Tabs
					aria-label="Job Settings Navigation"
					variant="light"
					selectedKey={pathname}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
						cursor: "shadow-none",
					}}
				>
					<Tab
						key={links.jobDetailSettings(params.slug, params.jobSlug)}
						href={links.jobDetailSettings(params.slug, params.jobSlug)}
						title={
							<div className="flex items-center space-x-4">
								<Settings size={16} />
								<span>General</span>
							</div>
						}
					/>
					<Tab
						key={links.jobDetailSettingsApplicationForm(
							params.slug,
							params.jobSlug,
						)}
						href={links.jobDetailSettingsApplicationForm(
							params.slug,
							params.jobSlug,
						)}
						title={
							<div className="flex items-center space-x-4">
								<FileText size={16} />
								<span>Application Form</span>
							</div>
						}
					/>
				</Tabs>
			</div>
		</>
	);
}
