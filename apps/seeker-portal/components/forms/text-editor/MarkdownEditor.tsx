import { cn } from '@heroui/react';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import type { LexicalEditor } from 'lexical';
import type { ReactNode } from 'react';
import ToolbarPlugin from './ToolbarPlugin';

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
	const initialConfig = {
		namespace: 'MarkdownEditor',
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
		},
		nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, LinkNode, HorizontalRuleNode, TableNode, TableCellNode, TableRowNode],
		onError: (error: Error) => {
			console.error(error);
		},
		editorState: initialValue ? () => $convertFromMarkdownString(initialValue, TRANSFORMERS) : undefined
	};

	const handleChange = (editorState: any, editor: LexicalEditor) => {
		editorState.read(
			() => {
				const markdown = $convertToMarkdownString(TRANSFORMERS);
				onValueChange(markdown);
			},
			{ editor }
		);
	};

	return (
		<LexicalComposer initialConfig={initialConfig}>
			{' '}
			<div className='relative rounded-md w-full text-left'>
				<ToolbarPlugin />
				<div className='w-full relative bg-background'>
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								className={cn(
									'p-4 prose prose-foreground prose-sm focus:outline-none border-2 w-full min-w-full rounded-md min-h-56 whitespace-pre-wrap',
									{
										'border-danger': isInvalid,
										'border-background-700': !isInvalid
									}
								)}
							/>
						}
						placeholder={<div className='p-4 text-gray-500'>Enter some text...</div>}
						ErrorBoundary={() => <div>Something went wrong.</div>}
					/>
					{description}
				</div>
				<OnChangePlugin onChange={handleChange} />
				<HistoryPlugin />
				<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
			</div>
		</LexicalComposer>
	);
}
