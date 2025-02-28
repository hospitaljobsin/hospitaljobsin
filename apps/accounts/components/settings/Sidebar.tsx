"use client";

import { Tab, Tabs } from "@heroui/react";
import { usePathname } from "next/navigation";

export default function SettingsSidebar() {
	const pathname = usePathname();
	return (
		<>
			<div className="md:h-[calc(100vh-4rem)] w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky md:top-16">
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
					}}
				>
					<Tab key="/settings" href="/settings" title="Account" />
					<Tab
						key="/settings/passkeys"
						href="/settings/passkeys"
						title="Passkeys"
					/>
					<Tab
						key="/settings/sessions"
						href="/settings/sessions"
						title="Sessions"
					/>
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start">
				<Tabs
					aria-label="Settings Navigation"
					variant="light"
					selectedKey={pathname}
				>
					<Tab key="/settings" href="/settings" title="Account" />
					<Tab
						key="/settings/passkeys"
						href="/settings/passkeys"
						title="Passkeys"
					/>
					<Tab
						key="/settings/sessions"
						href="/settings/sessions"
						title="Sessions"
					/>
				</Tabs>
			</div>
		</>
	);
}
