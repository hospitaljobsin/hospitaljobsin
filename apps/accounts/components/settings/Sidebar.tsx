import { Link } from "@heroui/react";

export default function SettingsSidebar() {
	return (
		<div className="h-screen w-64 p-4 bg-background-700 flex justify-end">
			<nav className="flex flex-col space-y-2">
				<Link href="/settings/profile" className="text-blue-500">
					Profile
				</Link>
				<Link href="/settings/account" className="text-blue-500">
					Account
				</Link>
				<Link href="/settings/security" className="text-blue-500">
					Security
				</Link>
			</nav>
		</div>
	);
}
