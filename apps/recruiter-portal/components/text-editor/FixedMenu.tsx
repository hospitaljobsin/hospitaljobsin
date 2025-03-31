import { Button } from "@heroui/react";
import type { Editor } from "@tiptap/react";
import { List, Minus, Quote } from "lucide-react";

interface FixedMenuProps {
	editor: Editor | null;
}

// Fixed menu component with a full set of formatting options
export default function FixedMenu({ editor }: FixedMenuProps) {
	if (!editor) return null;

	return (
		<div className="w-full z-10">
			<div className="max-w-4xl mx-auto flex gap-2 items-center">
				<Button
					size="sm"
					isIconOnly
					onPress={() => editor.chain().focus().toggleBold().run()}
					variant={editor.isActive("bold") ? "solid" : "bordered"}
					className="text-foreground-400 font-semibold text-md"
				>
					B
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() => editor.chain().focus().toggleItalic().run()}
					variant={editor.isActive("italic") ? "solid" : "bordered"}
					className="text-foreground-400 font-medium italic text-md"
				>
					I
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() => editor.chain().focus().toggleStrike().run()}
					variant={editor.isActive("strike") ? "solid" : "bordered"}
					className="text-foreground-400 font-medium line-through text-md"
				>
					S
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					variant={
						editor.isActive("heading", { level: 1 }) ? "solid" : "bordered"
					}
					className="text-foreground-400 font-medium text-sm"
				>
					H1
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					variant={
						editor.isActive("heading", { level: 2 }) ? "solid" : "bordered"
					}
					className="text-foreground-400 font-medium text-sm"
				>
					H2
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					variant={
						editor.isActive("heading", { level: 3 }) ? "solid" : "bordered"
					}
					className="text-foreground-400 font-medium text-sm"
				>
					H3
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() =>
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					}
					variant={
						editor.isActive("heading", { level: 4 }) ? "solid" : "bordered"
					}
					className="text-foreground-400 font-medium text-sm"
				>
					H4
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() =>
						editor.chain().focus().toggleHeading({ level: 5 }).run()
					}
					variant={
						editor.isActive("heading", { level: 5 }) ? "solid" : "bordered"
					}
					className="text-foreground-400 font-medium text-sm"
				>
					H5
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() =>
						editor.chain().focus().toggleHeading({ level: 6 }).run()
					}
					variant={
						editor.isActive("heading", { level: 6 }) ? "solid" : "bordered"
					}
					className="text-foreground-400 font-medium text-sm"
				>
					H6
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() => editor.chain().focus().toggleBulletList().run()}
					variant={editor.isActive("bulletList") ? "solid" : "bordered"}
				>
					<List size={20} className="text-foreground-400" />
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() => editor.chain().focus().toggleBlockquote().run()}
					variant={editor.isActive("blockquote") ? "solid" : "bordered"}
				>
					<Quote
						size={18}
						strokeWidth={1.5}
						className="fill-foreground-400 text-foreground-400"
					/>
				</Button>
				<Button
					size="sm"
					isIconOnly
					onPress={() => editor.chain().focus().setHorizontalRule().run()}
					variant="bordered"
				>
					<Minus size={20} className="text-foreground-400" />
				</Button>
			</div>
		</div>
	);
}
