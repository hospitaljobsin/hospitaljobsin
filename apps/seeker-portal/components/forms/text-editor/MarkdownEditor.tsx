import { cn } from '@heroui/theme';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode } from '@lexical/rich-text';
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
import { type ReactNode } from 'react';
import ToolbarPlugin from './ToolbarPlugin';

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

const getExtraStyles = (element: HTMLElement): string => {
	let extraStyles = '';
	// Example: parseAllowedFontSize, parseAllowedColor could be implemented as needed
	// For now, just return ''
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
	initialValue
}: {
	description: ReactNode;
	isInvalid: boolean;
	onValueChange: (value: string) => void;
	initialValue: string;
}) {
	const editorConfig = {
		editorState: () => $convertFromMarkdownString(initialValue, TRANSFORMERS),
		html: {
			export: exportMap,
			import: constructImportMap()
		},
		namespace: 'MarkdownEditor',
		nodes: [ParagraphNode, TextNode, HeadingNode],
		onError(error: Error) {
			throw error;
		},
		theme: {
			paragraph: 'w-full min-w-full text-foreground-800',
			heading: {
				h1: 'text-2xl font-medium',
				h2: 'text-xl font-medium',
				h3: 'text-lg font-medium'
			},
			list: {
				ul: 'list-disc list-inside',
				ol: 'list-decimal list-inside'
			},
			quote: 'border-l-4 border-gray-300 pl-4 italic',
			text: {
				underline: 'underline',
				bold: 'font-bold',
				italic: 'italic'
			}
		} satisfies EditorThemeClasses
	};

	function handleOnChange(_editorState: EditorState, editor: LexicalEditor) {
		editor.update(() => {
			const markdown = $convertToMarkdownString(TRANSFORMERS);
			onValueChange(markdown);
		});
	}
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className='w-full flex flex-col gap-6'>
				<ToolbarPlugin />
				<div className='w-full flex flex-col gap-4'>
					<div className='w-full'>
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									className={cn('min-h-32 p-2 border rounded-md', {
										'border-danger': isInvalid,
										'border-gray-300': !isInvalid
									})}
								/>
							}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<HistoryPlugin />
						<OnChangePlugin onChange={handleOnChange} />
					</div>
					{description}
				</div>
			</div>
		</LexicalComposer>
	);
}
