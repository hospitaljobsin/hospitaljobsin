"use client";
import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { BriefcaseBusiness, HomeIcon, UserIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function OrganizationTabs() {
	const pathnname = usePathname();
	const params = useParams<{ slug: string }>();
	return (
		<div className="flex w-full flex-col border-b border-gray-300 py-4">
			<Tabs
				aria-label="Organization Detail Menu"
				color="default"
				variant="light"
				selectedKey={pathnname}
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
					key={links.organizationDetailJobs(params.slug)}
					href={links.organizationDetailJobs(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<BriefcaseBusiness />
							<span>Jobs</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}
