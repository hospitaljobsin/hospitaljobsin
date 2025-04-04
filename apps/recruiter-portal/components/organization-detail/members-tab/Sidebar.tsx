"use client";

import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { Mail, User } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function MembersSidebar() {
	const pathname = usePathname();
	const params = useParams<{ slug: string }>();
	return (
		<>
			<div className="w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky top-0 self-stretch max-h-screen">
				<Tabs
					aria-label="Members Navigation"
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
					}}
				>
					<Tab
						key={links.organizationDetailMembers(params.slug)}
						href={links.organizationDetailMembers(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<User size={20} />
								<span>Members</span>
							</div>
						}
					/>
					<Tab
						key={links.organizationDetailMemberInvites(params.slug)}
						href={links.organizationDetailMemberInvites(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<Mail size={20} />
								<span>Invites</span>
							</div>
						}
					/>
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start">
				<Tabs
					aria-label="Members Navigation"
					variant="light"
					selectedKey={pathname}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
					}}
				>
					<Tab
						key={links.organizationDetailMembers(params.slug)}
						href={links.organizationDetailMembers(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<User size={16} />
								<span>Members</span>
							</div>
						}
					/>
					<Tab
						key={links.organizationDetailMemberInvites(params.slug)}
						href={links.organizationDetailMemberInvites(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<Mail size={16} />
								<span>Invites</span>
							</div>
						}
					/>
				</Tabs>
			</div>
		</>
	);
}
