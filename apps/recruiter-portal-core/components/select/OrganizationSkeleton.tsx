import { Card, CardHeader, Skeleton } from "@heroui/react";

export default function OrganizationSkeleton() {
	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer"
			isPressable={false}
			as="div"
			disableRipple
			shadow="none"
			isHoverable={false}
		>
			<CardHeader>
				<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
					<div className="flex items-center gap-4 w-full">
						<Skeleton className="flex rounded-md w-18 h-18" />
						<div className="flex flex-col gap-2 items-start w-full">
							<Skeleton className="flex rounded-lg w-2/5 h-8" />
							<Skeleton className="flex rounded-lg w-4/5 h-12" />
						</div>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}
