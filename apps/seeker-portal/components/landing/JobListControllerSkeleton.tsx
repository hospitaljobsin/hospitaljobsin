"use client";
import { Card, CardBody, Input, Slider } from "@heroui/react";
import { MapPin, Search } from "lucide-react";

export default function JobListControllerSkeleton() {
	return (
		<div className="flex flex-col gap-4 w-full">
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
				placeholder="Search for jobs, in plain English"
				variant="bordered"
				fullWidth
				isDisabled
			/>

			<div className="flex gap-4 w-full">
				<Card className="w-full" shadow="none">
					<CardBody className="p-4">
						<div className="flex flex-col sm:flex-row gap-4 w-full">
							<div className="flex-1">
								<Input
									placeholder="Filter by location"
									startContent={
										<MapPin size={18} className="text-default-400" />
									}
									fullWidth
									isDisabled
								/>
							</div>
							<div className="flex-1">
								<div className="flex flex-col gap-2">
									<Slider
										label="Proximity"
										size="sm"
										step={5}
										minValue={0}
										maxValue={100}
										value={0}
										className="max-w-md"
										showOutline={true}
										isDisabled
									/>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
