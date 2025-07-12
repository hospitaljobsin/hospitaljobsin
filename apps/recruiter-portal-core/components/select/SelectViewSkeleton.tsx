"use client";
import OrganizationListSkeleton from "./OrganizationListSkeleton";

export default function SelectViewSkeleton() {
	return (
		<div className="w-full h-full flex flex-col py-6 gap-6 overflow-y-hidden">
			<OrganizationListSkeleton count={3} />
		</div>
	);
}
