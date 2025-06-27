"use client";
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Skeleton,
} from "@heroui/react";

export default function JobSkeleton() {
	return (
		<Card
			isHoverable={false}
			fullWidth
			className="p-3 sm:p-6 rounded-xl border border-default-200 bg-background"
			shadow="none"
		>
			<CardHeader>
				<div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-6 items-start sm:items-center">
					<div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
						<Skeleton className="flex rounded-md w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
						<div className="flex flex-col gap-1 items-start min-w-0 w-full">
							<Skeleton className="flex rounded-lg w-3/5 h-6 sm:h-8 max-w-full sm:max-w-none" />
							<Skeleton className="flex rounded-lg w-2/5 h-4 sm:h-6 max-w-full sm:max-w-none" />
						</div>
					</div>
					<div className="mt-2 sm:mt-0 w-full sm:w-auto flex justify-start sm:justify-end">
						<Skeleton className="flex rounded-lg w-2/5 h-6 sm:w-1/5 sm:h-8" />
					</div>
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-4 sm:gap-6 w-full">
				<div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 w-full">
					<Skeleton className="flex rounded-lg w-1/5 h-4" />
				</div>
				<div className="flex flex-wrap justify-start gap-2 sm:gap-8 items-start text-foreground-600 w-full text-left sm:text-center">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton
							key={`meta-${i}-${Math.random().toString(36).substr(2, 5)}`}
							className="flex rounded-md w-20 h-5 sm:w-28 sm:h-6 px-2 py-1"
						/>
					))}
				</div>
			</CardBody>
			<CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6 w-full text-left sm:text-left">
				<div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 w-full sm:w-auto justify-start">
					{[...Array(4)].map(() => {
						const key = Math.random().toString(36).substr(2, 9);
						return (
							<Skeleton
								key={key}
								className="flex rounded-full w-16 h-6 sm:w-20 sm:h-8 text-xs sm:text-sm px-2 py-1"
							/>
						);
					})}
				</div>
				<div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
					<Skeleton className="flex rounded-lg w-16 h-8 sm:w-24 sm:h-8" />
				</div>
			</CardFooter>
		</Card>
	);
}
