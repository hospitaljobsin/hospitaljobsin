import { Card, CardBody, Skeleton } from "@heroui/react";

export default function MemberSkeleton() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardBody className="flex items-center gap-6 w-full flex-row">
				<div className="w-full flex flex-col gap-4">
					<div className="flex gap-4 items-baseline">
						<Skeleton className="flex rounded-lg w-2/5 h-8" />
						<Skeleton className="flex rounded-lg w-1/5 h-8" />
					</div>
					<Skeleton className="flex rounded-lg w-2/5 h-6" />
				</div>
			</CardBody>
		</Card>
	);
}
