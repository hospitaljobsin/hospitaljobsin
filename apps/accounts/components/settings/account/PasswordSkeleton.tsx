import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export default function PasswordSkeleton() {
	return (
		<Card className="p-4 sm:p-6" shadow="none">
			<CardHeader className="flex flex-col gap-4 items-start">
				<Skeleton className="w-1/3 rounded-md h-6" />
			</CardHeader>
			<CardBody>
				<div className="w-full flex gap-12">
					<Skeleton className="w-full rounded-md h-12" />
					<Skeleton className="w-full rounded-md h-12" />
				</div>
			</CardBody>
		</Card>
	);
}
