import { Skeleton } from "@heroui/react";

export default function ProfileViewSkeleton() {
	return (
		<div className="w-full h-full space-y-16 py-8">
			<Skeleton className="w-full h-48 rounded-md" />
			<Skeleton className="w-full h-48 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />

			<Skeleton className="w-full h-64 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />
			<Skeleton className="w-full h-64 rounded-md" />
		</div>
	);
}
