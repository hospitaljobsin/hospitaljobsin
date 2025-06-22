"use client";

import type { ProfessionalSummaryFragment$key } from "@/__generated__/ProfessionalSummaryFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditIcon, ScrollIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import { Markdown } from "tiptap-markdown";

const ProfessionalSummaryFragment = graphql`
  fragment ProfessionalSummaryFragment on Profile {
    professionalSummary
  }
`;

type Props = {
	rootQuery: ProfessionalSummaryFragment$key;
	onEditProfile: () => void;
};

export default function ProfessionalSummary({
	rootQuery,
	onEditProfile,
}: Props) {
	const data = useFragment(ProfessionalSummaryFragment, rootQuery);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false, // Disable default heading
			}),
			Heading.configure({
				levels: [1, 2, 3], // Allow only H1, H2, and H3
			}),
			Markdown,
		],
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-foreground prose-sm w-full min-w-full whitespace-pre-wrap",
			},
		},
		editable: false, // Disable editing to make it a viewer
		content: data.professionalSummary,
	});

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<ScrollIcon />
						<h1 className="w-full text-sm font-medium">Professional Summary</h1>
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
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						{!data.professionalSummary ? (
							<div className="w-full flex flex-col gap-2">
								<h2 className="w-full text-foreground-600">
									Add your professional summary
								</h2>
								<p className="w-full text-foreground-500">
									Talk about your strengths, skills, and experience.
								</p>
							</div>
						) : (
							<h2 className="w-full text-foreground-500">
								<EditorContent editor={editor} className="w-full" />
							</h2>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
