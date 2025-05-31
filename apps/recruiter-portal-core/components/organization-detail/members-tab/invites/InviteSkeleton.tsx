import { Card, CardBody, Skeleton } from "@heroui/react";

export default function InviteSkeleton() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardBody className="flex flex-col lg:flex-row items-center justify-between gap-4 duration-200 w-full">
				<div className="flex items-center gap-6 w-full">
					<Skeleton className="flex rounded-full w-10 h-10" />
					<div className="flex flex-col gap-4">
						<Skeleton className="flex rounded-lg w-32 h-6" />
						<div className="text-sm text-foreground-400 flex items-center gap-2">
							<Skeleton className="flex rounded-lg w-24 h-4" />
						</div>
					</div>
				</div>

				<div className="flex items-center gap-4 md:gap-6 w-full justify-end">
					<div className="flex items-center gap-2 text-foreground-400">
						<Skeleton className="flex rounded-full w-4 h-4" />
						<Skeleton className="flex rounded-lg w-16 h-4" />
					</div>
					<div className="flex items-center gap-2 text-foreground-400">
						<Skeleton className="flex rounded-full w-4 h-4" />
						<Skeleton className="flex rounded-lg w-20 h-4" />
					</div>
					<Skeleton className="flex rounded-md w-8 h-8" />
				</div>
			</CardBody>
		</Card>
	);
}
