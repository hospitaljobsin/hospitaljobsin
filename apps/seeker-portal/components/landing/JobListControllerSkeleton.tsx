"use client";
import { Card, CardBody, Input, Slider } from "@heroui/react";
import { MapPin, Search } from "lucide-react";

export default function JobListControllerSkeleton() {
	return (
		<form className="flex flex-col gap-4 w-full">
			<Input
				size="lg"
				classNames={{
					inputWrapper: "p-4 sm:p-8 bg-background",
					mainWrapper: "mt-4 sm:-mt-20",
				}}
				startContent={
					<Search
						size={24}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				isClearable
				placeholder="Search for your next job"
				variant="bordered"
				fullWidth
				isDisabled
			/>

			<div className="flex gap-4 w-full">
				<Card className="w-full" shadow="none">
					<CardBody className="p-4">
						<div className="flex flex-col sm:flex-row gap-8 w-full items-center">
							<div className="flex-1 w-full">
								<Input
									size="md"
									placeholder="Filter by location"
									startContent={
										<MapPin size={18} className="text-foreground-400" />
									}
									fullWidth
									isDisabled
								/>
							</div>
							<div className="flex-1 w-full">
								<Slider
									label="Proximity"
									size="sm"
									step={5}
									minValue={0}
									maxValue={100}
									value={1}
									className="max-w-md"
									showOutline
									formatOptions={{ style: "unit", unit: "kilometer" }}
									isDisabled
								/>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</form>
	);
}
