import { Skeleton } from "@heroui/react";
import DashboardHeaderSkeleton from "../layout/DashboardHeaderSkeleton";

export default function ProfileViewSkeleton() {
	return (
		<div className="w-full flex flex-col flex-1 h-full">
			<DashboardHeaderSkeleton />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">
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
				</div>
			</div>
		</div>
	);
}
