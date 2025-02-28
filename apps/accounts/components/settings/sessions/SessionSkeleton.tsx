import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Skeleton,
} from "@heroui/react";

export default function SessionSkeleton() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isDisabled shadow="none">
			<CardHeader className="w-full flex justify-between gap-6">
				<div className="flex gap-4 items-center w-full">
					<Skeleton className="w-10 h-10 rounded-full" />
					<Skeleton className="w-1/2 h-6 rounded-md" />
				</div>
				<Skeleton className="w-8 h-8 rounded-md" />
			</CardHeader>
			<CardBody>
				<Skeleton className="w-3/4 h-6 rounded-md" />
			</CardBody>
			<CardFooter>
				<Skeleton className="w-1/3 h-6 rounded-md" />
			</CardFooter>
		</Card>
	);
}
