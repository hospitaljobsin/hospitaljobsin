import type { WorkExperienceFragment$key } from "@/__generated__/WorkExperienceFragment.graphql";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { EditIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const WorkExperienceFragment = graphql`
  fragment WorkExperienceFragment on Profile {
    __typename
    workExperience {
      title
      organization
      startedAt
      completedAt
      employmentType
	  skills
    }
  }
`;

type Props = {
	rootQuery: WorkExperienceFragment$key;
	onEditProfile: () => void;
};

export default function WorkExperience({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(WorkExperienceFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<h1 className="w-full text-lg font-medium">Work Experience</h1>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="light"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.workExperience.length < 1 ? (
						<h2 className="w-full text-foreground-500">
							Add your work experience
						</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.workExperience.map(
								(
									exp: {
										title: string;
										organization: string;
										startedAt: string;
										completedAt: string;
										employmentType: string;
										skills?: readonly string[];
									},
									idx: number,
								) => (
									<div
										className="flex gap-4 flex-col items-center w-full"
										key={`${exp.title}-${exp.organization}-${exp.startedAt}-${exp.completedAt}-${idx}`}
									>
										<h3 className="w-full text-foreground-500 text-lg font-medium">
											{exp.title}
										</h3>
										<div className="w-full flex gap-2 text-foreground-500">
											<p>Organization:</p>
											<p className="italic">{exp.organization}</p>
										</div>
										{exp.employmentType && (
											<div className="w-full flex gap-2 text-foreground-500">
												<p>Employment Type:</p>
												<p className="italic">{exp.employmentType}</p>
											</div>
										)}
										{exp.skills && exp.skills.length > 0 && (
											<div className="w-full flex flex-wrap gap-2 mb-2">
												{exp.skills.map((skill: string) => (
													<Chip key={skill}>{skill}</Chip>
												))}
											</div>
										)}
										<div className="w-full flex gap-2 text-foreground-500">
											<p>Duration:</p>
											<p className="italic">
												{exp.startedAt
													? new Date(exp.startedAt).toLocaleString("default", {
															month: "short",
															year: "numeric",
														})
													: "N/A"}
												{" - "}
												{exp.completedAt
													? new Date(exp.completedAt).toLocaleString(
															"default",
															{
																month: "short",
																year: "numeric",
															},
														)
													: "Present"}
											</p>
										</div>
									</div>
								),
							)}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
