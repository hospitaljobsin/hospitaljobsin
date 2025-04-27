import { Card, CardHeader, Skeleton } from "@heroui/react";

export default function AccountDetailsSkeleton() {
	return (
		<Card className="p-6 space-y-6" shadow="none">
			<CardHeader className="flex flex-col sm:flex-row gap-6 w-full items-end sm:items-center justify-between">
				<div className="flex gap-6 w-full items-center justify-start">
					<Skeleton className="h-12 w-12 rounded-full " />
					<div className="flex flex-col gap-4 w-full items-start justify-center">
						<Skeleton className="w-2/3 h-6 rounded-md" />
						<Skeleton className="w-3/4 h-6 rounded-md" />
					</div>
				</div>
				<Skeleton className="w-1/4 h-8 rounded-md" />
			</CardHeader>
		</Card>
	);
}
