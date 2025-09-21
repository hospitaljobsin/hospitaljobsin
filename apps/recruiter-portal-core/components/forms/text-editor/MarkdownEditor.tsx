import { cn } from '@heroui/theme';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertFromMarkdownString, $convertToMarkdownString, type TextFormatTransformer, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
	$isTextNode,
	type DOMConversionMap,
	type DOMExportOutput,
	type DOMExportOutputMap,
	type EditorState,
	type EditorThemeClasses,
	isHTMLElement,
	type Klass,
	type LexicalEditor,
	type LexicalNode,
	ParagraphNode,
	TextNode
} from 'lexical';
import type { ReactNode } from 'react';
import ToolbarPlugin from './ToolbarPlugin';

// Define a custom underline transformer
const UNDERLINE_TRANSFORMER: TextFormatTransformer = {
	format: ['underline'],
	tag: '__',
	type: 'text-format'
};

const CUSTOM_TRANSFORMERS = [...TRANSFORMERS, UNDERLINE_TRANSFORMER];

// Remove styles from exported DOM for ParagraphNode and TextNode
const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
	const output = target.exportDOM(editor);
	if (output && isHTMLElement(output.element)) {
		for (const el of [output.element, ...output.element.querySelectorAll('[style],[class]')]) {
			el.removeAttribute('class');
			el.removeAttribute('style');
		}
	}
	return output;
};

const exportMap: DOMExportOutputMap = new Map<Klass<LexicalNode>, (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput>([
	[ParagraphNode, removeStylesExportDOM],
	[TextNode, removeStylesExportDOM]
]);

const getExtraStyles = (_element: HTMLElement): string => {
	let extraStyles = '';
	// Example: parseAllowedFontSize, parseAllowedColor could be implemented as needed
	return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
	const importMap: DOMConversionMap = {};
	for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
		importMap[tag] = importNode => {
			const importer = fn(importNode);
			if (!importer) {
				return null;
			}
			return {
				...importer,
				conversion: element => {
					const output = importer.conversion(element);
					if (output === null || output.forChild === undefined || output.after !== undefined || output.node !== null) {
						return output;
					}
					const extraStyles = getExtraStyles(element);
					if (extraStyles) {
						const { forChild } = output;
						return {
							...output,
							forChild: (child, parent) => {
								const textNode = forChild(child, parent);
								if ($isTextNode(textNode)) {
									textNode.setStyle(textNode.getStyle() + extraStyles);
								}
								return textNode;
							}
						};
					}
					return output;
				}
			};
		};
	}
	return importMap;
};

export default function MarkdownEditor({
	description,
	isInvalid,
	onValueChange,
	initialValue,
	className,
	editable = true
}: {
	description?: ReactNode;
	isInvalid?: boolean;
	onValueChange?: (value: string) => void;
	initialValue: string;
	editable?: boolean;
	className?: string;
}) {
	const editorConfig = {
		editable,
		editorState: () => $convertFromMarkdownString(initialValue, CUSTOM_TRANSFORMERS),
		html: {
			export: exportMap,
			import: constructImportMap()
		},
		namespace: 'MarkdownEditor',
		nodes: [ParagraphNode, TextNode, HeadingNode, HorizontalRuleNode, CodeNode, LinkNode, ListNode, ListItemNode, QuoteNode],
		onError(error: Error) {
			throw error;
		},
		theme: {
			// Minimal theme to avoid conflicts with prose-sm
			text: {
				underline: 'underline',
				bold: 'font-bold',
				italic: 'italic'
			}
		} satisfies EditorThemeClasses
	};

	function handleOnChange(_editorState: EditorState, editor: LexicalEditor) {
		editor.update(() => {
			const markdown = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
			onValueChange?.(markdown);
		});
	}

	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className='w-full flex flex-col gap-6'>
				{editable ? <ToolbarPlugin /> : null}
				<div className='w-full flex flex-col gap-4'>
					<div className='w-full'>
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									className={cn(
										'prose prose-sm prose-foreground max-w-full min-h-32 rounded-md focus:outline-none',
										{
											'border-danger': isInvalid,
											'border-gray-300': !isInvalid,
											'border p-4': editable
										},
										className
									)}
								/>
							}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<MarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />
						<HistoryPlugin />
						<ListPlugin />
						<OnChangePlugin onChange={handleOnChange} />
					</div>
					{description}
				</div>
			</div>
		</LexicalComposer>
	);
}
