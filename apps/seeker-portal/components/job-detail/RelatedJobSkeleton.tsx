import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export default function RelatedJobSkeleton() {
	return (
		<Card
			className="p-4 sm:p-6 cursor-pointer w-full lg:max-w-sm"
			isPressable
			as="div"
			disableRipple
			shadow="none"
		>
			<CardHeader>
				<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
					<div className="flex items-center gap-4">
						<Skeleton className="flex rounded-full w-12 h-12" />
						<div className="flex flex-col gap-2 items-start">
							<Skeleton className="flex rounded-lg w-2/5 h-8" />
							<Skeleton className="flex rounded-lg w-1/5 h-6" />
						</div>
					</div>
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-6 w-full">
				<div className="flex flex-wrap justify-start gap-4 items-start text-foreground-600 w-full text-center text-sm">
					<Skeleton className="flex rounded-lg w-28  h-6" />
					<Skeleton className="flex rounded-lg w-28  h-6" />
					<Skeleton className="flex rounded-lg w-28  h-6" />
					<Skeleton className="flex rounded-lg w-28  h-6" />
					<Skeleton className="flex rounded-lg w-28  h-6" />
				</div>
			</CardBody>
		</Card>
	);
}
