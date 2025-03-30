import { Button } from "@heroui/react";
import { Editor } from "slate";
import { useSlate } from "slate-react";

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format);
	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

export default function Toolbar() {
	const editor = useSlate();

	return (
		<div style={{ display: "flex", gap: "8px" }}>
			<Button
				isDisabled={isMarkActive(editor, "bold")}
				onMouseDown={(event) => {
					event.preventDefault();
					toggleMark(editor, "bold");
				}}
			>
				B
			</Button>
			<Button
				isDisabled={isMarkActive(editor, "italic")}
				onMouseDown={(event) => {
					event.preventDefault();
					toggleMark(editor, "italic");
				}}
			>
				I
			</Button>
		</div>
	);
}
