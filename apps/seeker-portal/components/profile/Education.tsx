import type { EducationFragment$key } from "@/__generated__/EducationFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { BookIcon, EditIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const EducationFragment = graphql`
  fragment EducationFragment on Profile {
    __typename
    education {
      degree
      institution
      startedAt
      completedAt
    }
  }
`;

type Props = {
	rootQuery: EducationFragment$key;
	onEditProfile: () => void;
};

export default function Education({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(EducationFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<BookIcon />
						<h1 className="w-full text-sm font-medium">Education</h1>
					</div>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="light"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.education.length < 1 ? (
						<h2 className="w-full text-foreground-500">
							Add your education history
						</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.education.map((edu, idx) => (
								<div
									className="flex gap-4 flex-col items-center w-full"
									key={`${edu.degree}-${edu.institution}-${edu.startedAt}-${edu.completedAt}-${idx}`}
								>
									<h3 className="w-full text-foreground-500 text-lg font-medium">
										{edu.degree}
									</h3>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Institution:</p>
										<p className="italic">{edu.institution}</p>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Duration:</p>
										<p className="italic">
											{edu.startedAt
												? new Date(edu.startedAt).toLocaleString("default", {
														month: "short",
														year: "numeric",
													})
												: "N/A"}
											{" - "}
											{edu.completedAt
												? new Date(edu.completedAt).toLocaleString("default", {
														month: "short",
														year: "numeric",
													})
												: "Present"}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
