import { Tab, Tabs } from "@heroui/react";
import { HomeIcon, UserIcon } from "lucide-react";

export default function OrganizationTabs() {
	return (
		<div className="flex w-full flex-col border-b border-gray-300 py-4">
			<Tabs aria-label="Options" color="default" variant="light">
				<Tab
					key="photos"
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key="music"
					title={
						<div className="flex items-center space-x-2">
							<UserIcon />
							<span>Members</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}
