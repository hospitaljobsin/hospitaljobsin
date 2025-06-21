"use client";

import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { CheckCircle, XCircle } from "lucide-react";

type CompletionStatus = {
	personalDetails: boolean;
	workExperience: boolean;
	education: boolean;
	locationPreferences: boolean;
};

export default function ProfileCompletionMeter({
	status,
}: {
	status: CompletionStatus;
}) {
	const sections = [
		{ name: "Personal Details", isComplete: status.personalDetails },
		{ name: "Work Experience", isComplete: status.workExperience },
		{ name: "Education", isComplete: status.education },
		{ name: "Location Preferences", isComplete: status.locationPreferences },
	];

	const completedCount = sections.filter((s) => s.isComplete).length;
	const totalCount = sections.length;
	const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	if (percentage === 100) return null;

	return (
		<Card className="p-6" shadow="none">
			<CardHeader className="flex flex-col gap-2 w-full items-start">
				<h3 className="text-lg font-medium">Complete Your Profile</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Complete the following sections to be able to apply for jobs.
				</p>
			</CardHeader>
			<CardBody className="flex flex-col gap-12 mt-6">
				<Progress
					aria-label="Profile completion"
					size="md"
					value={percentage}
					label={`${completedCount} of ${totalCount} sections completed`}
					showValueLabel
					valueLabel={`${Math.round(percentage)}%`}
					color="primary"
				/>

				<ul className="space-y-6">
					{sections.map((section) => (
						<li key={section.name} className="flex items-center">
							{section.isComplete ? (
								<CheckCircle className="h-5 w-5 text-green-500" />
							) : (
								<XCircle className="h-5 w-5 text-red-500" />
							)}
							<span className="ml-2 text-sm">{section.name}</span>
						</li>
					))}
				</ul>
			</CardBody>
		</Card>
	);
}
