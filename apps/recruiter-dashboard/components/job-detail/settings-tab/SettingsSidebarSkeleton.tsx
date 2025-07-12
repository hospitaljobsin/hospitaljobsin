"use client";

export default function SettingsSidebarSkeleton() {
	return (
		<>
			<div className="w-64 p-4 bg-background-700 justify-start hidden md:flex md:sticky top-0 self-stretch max-h-screen" />
			<div className="w-full md:hidden p-4 bg-background-700 flex justify-start" />
		</>
	);
}
