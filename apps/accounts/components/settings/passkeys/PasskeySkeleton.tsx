import { Card, CardFooter, CardHeader, Skeleton } from "@heroui/react";

export default function PasskeySkeleton() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardHeader className="w-full flex justify-between gap-6">
				<div className="flex gap-4 items-center w-full">
					<Skeleton className="h-10 w-10 rounded-full" />
					<Skeleton className="h-6 rounded-md w-1/2" />
				</div>
				<div className="flex items-center">
					<Skeleton className="h-10 w-10 rounded-md" />
				</div>
			</CardHeader>

			<CardFooter className="w-full flex justify-end sm:justify-start">
				<Skeleton className="h-6 rounded-md w-1/3" />
			</CardFooter>
		</Card>
	);
}
