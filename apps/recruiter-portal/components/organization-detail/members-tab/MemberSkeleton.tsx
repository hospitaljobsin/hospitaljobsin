import { Card, CardBody, Skeleton } from "@heroui/react";

export default function MemberSkeleton() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardBody className="flex items-center gap-6 w-full flex-row">
				<Skeleton className="flex rounded-full w-12 h-12" />
				<Skeleton className="flex rounded-lg w-2/5 h-8" />
			</CardBody>
		</Card>
	);
}
