"use client";

import { Tab, Tabs } from "@heroui/react";

// TODO: implement this skeleton properly

export default function OrgSettingsSidebarSkeleton() {
	return (
		<>
			<div className="w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky top-0 self-stretch max-h-screen">
				<Tabs
					aria-label="Settings Navigation"
					isVertical
					variant="light"
					selectedKey={pathname}
					onSelectionChange={(key) => {
						if (typeof key === "string") {
							router.push(key);
						}
					}}
					classNames={{
						tabWrapper: "w-full",
						base: "w-full",
						tabContent: "w-full",
						tabList: "w-full",
						panel: "h-full",
						tab: "py-5",
						cursor: "shadow-none",
					}}
				>
					{items.map((item) => (
						<Tab
							key={item.href}
							title={
								<div className="flex items-center space-x-4">
									<item.icon size={20} />
									<span>{item.label}</span>
								</div>
							}
						/>
					))}
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start">
				<Tabs
					aria-label="Settings Navigation"
					variant="light"
					selectedKey={pathname}
					onSelectionChange={(key) => {
						if (typeof key === "string") {
							router.push(key);
						}
					}}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
						cursor: "shadow-none",
					}}
				>
					{items.map((item) => (
						<Tab
							key={item.href}
							title={
								<div className="flex items-center space-x-4">
									<item.icon size={16} />
									<span>{item.label}</span>
								</div>
							}
						/>
					))}
				</Tabs>
			</div>
		</>
	);
}
