"use client";
import { Skeleton } from "@heroui/react";

export default function SidebarSkeleton() {
	return (
		<>
			{/* Mobile top bar */}
			<div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-foreground-300">
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="w-32 h-6 rounded-md" />
				</div>
				<Skeleton className="w-8 h-8 rounded-full" />
				{/* <AuthNavigation rootQuery={data.viewer} /> */}
			</div>
			{/* Sidebar for desktop */}
			<aside className="hidden md:flex flex-col w-64 min-w-64 h-full bg-background-900 border-r border-foreground-300 px-4 py-6 gap-8">
				{/* Organization switcher (desktop) */}
				<div className="flex items-center gap-4 mb-6">
					<div className="flex items-center gap-4 cursor-pointer w-full">
						<Skeleton className="h-8 w-8 rounded-md" />
						<Skeleton className="flex-1 h-6 rounded-md" />
					</div>
				</div>

				<div className="mt-auto">
					<Skeleton className="w-full h-12 rounded-md" />
					{/* <AuthNavigation rootQuery={data.viewer} /> */}
				</div>
			</aside>
		</>
	);
}
