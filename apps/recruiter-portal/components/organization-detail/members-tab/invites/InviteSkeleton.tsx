import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export default function InviteSkeleton() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardHeader className="w-full flex justify-between gap-6">
				<Skeleton className="flex rounded-lg w-2/5 h-8" />
				<Skeleton className="flex rounded-md w-8 h-8" />
			</CardHeader>
			<CardBody className="w-full flex gap-8 items-start sm:items-center flex-col sm:flex-row">
				<Skeleton className="flex rounded-lg w-2/5 h-8" />
				<Skeleton className="flex rounded-lg w-2/5 h-8" />
				<div className="flex gap-4 w-full items-center">
					<Skeleton className="flex rounded-lg w-2/5 h-8" />
					<Skeleton className="flex rounded-full w-8 h-8" />
				</div>
			</CardBody>
		</Card>
	);
}
