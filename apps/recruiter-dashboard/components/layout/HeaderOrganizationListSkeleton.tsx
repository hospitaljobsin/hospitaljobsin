import { DropdownItem, Skeleton } from "@heroui/react";

export default function HeaderOrganizationListSkeleton() {
	return (
		<>
			{Array.from({ length: 8 }).map((_, index) => (
				<DropdownItem
					key={`org-skeleton-${index}`}
					startContent={<Skeleton className="h-8 w-8 rounded-full" />}
				>
					<Skeleton className="h-4 w-24" />
				</DropdownItem>
			))}
		</>
	);
}
