"use client";

import type { AboutMeFragment$key } from "@/__generated__/AboutMeFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditIcon, ScrollIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import { Markdown } from "tiptap-markdown";

const AboutMeFragment = graphql`
  fragment AboutMeFragment on Profile {
    professionalSummary
	headline
  }
`;

type Props = {
	rootQuery: AboutMeFragment$key;
	onEditProfile: () => void;
};

export default function AboutMe({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(AboutMeFragment, rootQuery);

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
		<div className="space-y-12 sm:space-y-8 px-2 sm:px-0">
			<Card className="p-4 sm:p-6 space-y-6" shadow="none">
				<CardHeader className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full items-start sm:items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400 w-full">
						<ScrollIcon />
						<h1 className="w-full text-sm sm:text-base font-medium">
							About Me
						</h1>
					</div>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="flat"
						className="w-full sm:w-auto"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-8 sm:gap-12">
					<div className="flex flex-col gap-4 sm:gap-6 w-full items-start justify-start">
						<h2 className="w-full text-base sm:text-medium font-medium">
							Headline
						</h2>
						{!data.headline ? (
							<h2 className="w-full text-foreground-600">Add your headline</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.headline}</h2>
						)}
					</div>
					<div className="flex flex-col gap-4 sm:gap-6 w-full items-start justify-start">
						<h2 className="w-full text-base sm:text-medium font-medium">
							Professional Summary
						</h2>
						{!data.professionalSummary ? (
							<div className="w-full flex flex-col gap-1 sm:gap-2">
								<h2 className="w-full text-foreground-600">
									Add your professional summary
								</h2>
								<p className="w-full text-foreground-500 text-xs sm:text-sm">
									Talk about your strengths, skills, and experience.
								</p>
							</div>
						) : (
							<div className="w-full text-foreground-500">
								<EditorContent editor={editor} className="w-full" />
							</div>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
