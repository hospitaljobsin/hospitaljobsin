import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export default function TwoFactorAuthenticationSkeleton() {
	return (
		<>
			<Card className="p-4 sm:p-6" shadow="none">
				<CardHeader className="flex flex-col gap-4 items-start">
					<Skeleton className="w-1/3 rounded-md h-6" />
					<div className="w-full flex flex-col gap-2 justify-start">
						<Skeleton className="w-full rounded-md h-4" />
						<Skeleton className="w-2/3 rounded-md h-4" />
					</div>
				</CardHeader>
				<CardBody>
					<div className="w-full flex flex-col gap-12">
						<div className="w-full flex flex-col items-center gap-6">
							<div className="w-full flex flex-col sm:flex-row items-center gap-12 justify-between">
								<div className="flex flex-col gap-4 w-full">
									<Skeleton className="w-1/3 rounded-md h-6" />
									<div className="w-full flex flex-col gap-2 justify-start">
										<Skeleton className="w-full rounded-md h-4" />
										<Skeleton className="w-2/3 rounded-md h-4" />
									</div>
								</div>
								<Skeleton className="w-1/2 rounded-md h-12" />
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
