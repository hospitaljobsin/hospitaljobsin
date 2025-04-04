"use client";
import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { BriefcaseBusiness, HomeIcon, Settings, UserIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function OrganizationTabs() {
	const pathname = usePathname();
	const params = useParams<{ slug: string }>();

	function getSelectedKey(pathname: string) {
		if (pathname === links.organizationCreateJob(params.slug)) {
			return links.organizationDetailJobs(params.slug);
		}
		if (pathname === links.organizationDetailMemberInvites(params.slug)) {
			return links.organizationDetailMembers(params.slug);
		}
		return pathname;
	}

	return (
		<div className="flex w-full flex-col">
			<Tabs
				aria-label="Organization Detail Menu"
				color="default"
				variant="underlined"
				classNames={{
					tabList: "py-0",
					tab: "py-6",
				}}
				selectedKey={getSelectedKey(pathname)}
			>
				<Tab
					key={links.organizationDetail(params.slug)}
					href={links.organizationDetail(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailJobs(params.slug)}
					href={links.organizationDetailJobs(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<BriefcaseBusiness />
							<span>Jobs</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailMembers(params.slug)}
					href={links.organizationDetailMembers(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<UserIcon />
							<span>Members</span>
						</div>
					}
				/>

				<Tab
					key={links.organizationDetailSettings(params.slug)}
					href={links.organizationDetailSettings(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<Settings />
							<span>Settings</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}
