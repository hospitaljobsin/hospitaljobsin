import { cn } from "@heroui/react";
import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode } from "react";
import { Markdown } from "tiptap-markdown";
import FixedMenu from "./FixedMenu";

export default function MarkdownEditor({
	description,
	isInvalid,
	onValueChange,
	initialValue,
}: {
	description: ReactNode;
	isInvalid: boolean;
	onValueChange: (value: string) => void;
	initialValue: string;
}) {
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
		content: initialValue,
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		injectCSS: false,
		editorProps: {
			attributes: {
				class: cn(
					"p-4 prose prose-foreground prose-sm focus:outline-none border-2 w-full min-w-full rounded-md min-h-56 whitespace-pre-wrap",
					{
						"border-danger": isInvalid,
						"border-background-700": !isInvalid,
					},
				),
			},
		},
		onUpdate({ editor }) {
			// convert the editor's JSON to markdown
			const markdown = editor.storage.markdown.getMarkdown();
			onValueChange(markdown);
		},
	});
	return (
		<div className="w-full flex flex-col gap-4">
			<FixedMenu editor={editor} />
			<div className="flex flex-col w-full gap-1">
				<EditorContent editor={editor} className="w-full" />
				{description}
			</div>
		</div>
	);
}
