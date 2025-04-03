"use client";

import { Tab, Tabs } from "@heroui/react";
import { Cookie, Fingerprint, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SettingsSidebar() {
	const pathname = usePathname();
	return (
		<>
			<div className="md:h-[calc(100vh-4.2rem)] w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky md:top-16">
				<Tabs
					aria-label="Settings Navigation"
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
						key="/settings"
						href="/settings"
						title={
							<div className="flex items-center space-x-4">
								<UserIcon size={20} />
								<span>Account</span>
							</div>
						}
					/>
					<Tab
						key="/settings/passkeys"
						href="/settings/passkeys"
						title={
							<div className="flex items-center space-x-4">
								<Fingerprint size={20} />
								<span>Passkeys</span>
							</div>
						}
					/>
					<Tab
						key="/settings/sessions"
						href="/settings/sessions"
						title={
							<div className="flex items-center space-x-4">
								<Cookie size={20} />
								<span>Sessions</span>
							</div>
						}
					/>
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start">
				<Tabs
					aria-label="Settings Navigation"
					variant="light"
					selectedKey={pathname}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
					}}
				>
					<Tab
						key="/settings"
						href="/settings"
						title={
							<div className="flex items-center space-x-4">
								<UserIcon size={16} />
								<span>Account</span>
							</div>
						}
					/>
					<Tab
						key="/settings/passkeys"
						href="/settings/passkeys"
						title={
							<div className="flex items-center space-x-4">
								<Fingerprint size={16} />
								<span>Passkeys</span>
							</div>
						}
					/>
					<Tab
						key="/settings/sessions"
						href="/settings/sessions"
						title={
							<div className="flex items-center space-x-4">
								<Cookie size={16} />
								<span>Sessions</span>
							</div>
						}
					/>
				</Tabs>
			</div>
		</>
	);
}
