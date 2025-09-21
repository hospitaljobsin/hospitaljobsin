import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
	$isTextNode,
	type DOMConversionMap,
	type DOMExportOutput,
	type DOMExportOutputMap,
	isHTMLElement,
	type Klass,
	type LexicalEditor,
	type LexicalNode,
	ParagraphNode,
	TextNode
} from 'lexical';
import ToolbarPlugin from './ToolbarPlugin';

const placeholder = 'Enter some rich text...';

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

const editorConfig = {
	html: {
		export: exportMap,
		import: constructImportMap()
	},
	namespace: 'MarkdownEditor',
	nodes: [ParagraphNode, TextNode],
	onError(error: Error) {
		throw error;
	},
	theme: {
		paragraph: 'prose prose-foreground prose-sm w-full',
		heading: {
			h1: 'text-2xl font-bold',
			h2: 'text-xl font-bold',
			h3: 'text-lg font-bold'
		},
		list: {
			ul: 'list-disc list-inside',
			ol: 'list-decimal list-inside'
		},
		quote: 'border-l-4 border-gray-300 pl-4 italic'
	}
};

export default function MarkdownEditor() {
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className='editor-container'>
				<ToolbarPlugin />
				<div className='editor-inner'>
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								className='editor-input'
								aria-placeholder={placeholder}
								placeholder={<div className='editor-placeholder'>{placeholder}</div>}
							/>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
					<AutoFocusPlugin />
				</div>
			</div>
		</LexicalComposer>
	);
}
