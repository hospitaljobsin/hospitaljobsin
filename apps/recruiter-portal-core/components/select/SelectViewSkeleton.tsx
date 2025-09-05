"use client";
import { Skeleton } from "@heroui/react";
import OrganizationListSkeleton from "./OrganizationListSkeleton";

export default function SelectViewSkeleton() {
	return (
		<div className="w-full h-full flex flex-col py-6 gap-6">
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
				<div className="flex w-full gap-6 justify-between items-center">
					<div className="flex gap-4 items-center text-foreground-600">
						<h2 className="text-base font-medium">Select an organization</h2>
					</div>
					<Skeleton className="flex rounded-md w-32 h-8" />
				</div>
				<OrganizationListSkeleton count={3} />
			</div>
		</div>
	);
}
