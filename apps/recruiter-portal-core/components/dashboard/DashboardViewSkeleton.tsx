"use client";
import OrganizationListSkeleton from "./OrganizationListSkeleton";

export default function DashboardViewSkeleton() {
	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<OrganizationListSkeleton />
		</div>
	);
}
