'use client';

import type { SerializedEditorState } from 'lexical';
import { useMemo } from 'react';
import { CMSImage } from './CMSImage';

interface LexicalContentProps {
	content: SerializedEditorState;
}

type LexicalNode = Record<string, unknown> & {
	type: string;
	children?: LexicalNode[];
	text?: string;
	format?: number;
};

export function LexicalContent({ content }: LexicalContentProps) {
	const renderedContent = useMemo(() => {
		return renderLexicalContent(content);
	}, [content]);

	return <>{renderedContent}</>;
}

function extractTextFromChildren(children: LexicalNode[]): string {
	if (!children || !Array.isArray(children)) {
		return '';
	}

	return children
		.map(child => {
			if (child.text) {
				return child.text;
			}
			if (child.children && Array.isArray(child.children)) {
				return extractTextFromChildren(child.children);
			}
			return '';
		})
		.join('');
}

function renderLexicalContent(editorState: SerializedEditorState): React.ReactNode {
	if (!editorState?.root?.children) {
		return null;
	}

	return (editorState.root.children as LexicalNode[]).map((node, index) => {
		return renderNode(node, `node-${index}`);
	});
}

function renderNode(node: LexicalNode, key: string): React.ReactNode {
	const { type } = node;

	switch (type) {
		case 'paragraph': {
			return (
				<p key={key} className='mb-4'>
					{renderChildren(node.children || [])}
				</p>
			);
		}

		case 'heading': {
			const tag = (node.tag as string) || 'h2';
			const HeadingTag = tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
			const text = extractTextFromChildren(node.children || []);
			const id = text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');

			// Define heading classes based on tag
			const headingClasses: Record<string, string> = {
				h1: 'text-xl sm:text-2xl font-semibold mt-8 mb-4',
				h2: 'text-lg sm:text-xl font-semibold mt-8 mb-4',
				h3: 'text-md sm:text-lg font-medium mt-6 mb-3',
				h4: 'text-md sm:text-lg font-medium mt-4 mb-2',
				h5: 'text-base sm:text-md font-medium mt-4 mb-2',
				h6: 'text-sm sm:text-base font-medium mt-4 mb-2'
			};

			return (
				<HeadingTag key={key} id={id} className={headingClasses[tag] || headingClasses.h2}>
					{renderChildren(node.children || [])}
				</HeadingTag>
			);
		}

		case 'list': {
			const listType = node.listType as string;
			const ListTag = listType === 'bullet' ? 'ul' : 'ol';
			return (
				<ListTag key={key} className='mb-4'>
					{(node.children || []).map((child, idx) => renderNode(child, `${key}-${idx}`))}
				</ListTag>
			);
		}

		case 'listitem': {
			return <li key={key}>{renderChildren(node.children || [])}</li>;
		}

		case 'quote': {
			return (
				<blockquote key={key} className='border-l-4 border-primary pl-4 italic my-4'>
					{renderChildren(node.children || [])}
				</blockquote>
			);
		}

		case 'code': {
			const firstChild = (node.children || [])[0];
			const codeText = firstChild?.text || '';
			return (
				<pre key={key} className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4'>
					<code>{codeText}</code>
				</pre>
			);
		}

		case 'horizontalrule':
			return <hr key={key} className='my-8' />;

		case 'link': {
			const fields = node.fields as Record<string, unknown> | undefined;
			const url = (fields?.url as string) || (node.url as string) || '#';
			const newTab = fields?.newTab as boolean;
			return (
				<a
					key={key}
					href={url}
					target={newTab ? '_blank' : undefined}
					rel={newTab ? 'noopener noreferrer' : undefined}
					className='text-primary hover:underline'
				>
					{renderChildren(node.children || [])}
				</a>
			);
		}

		case 'block':
			return renderBlock(node, key);

		default: {
			if (node.children) {
				return renderChildren(node.children);
			}
			return null;
		}
	}
}

function renderChildren(children: LexicalNode[]): React.ReactNode {
	if (!children || !Array.isArray(children)) {
		return null;
	}

	return children.map((child, index) => {
		if (child.type === 'text') {
			return renderTextNode(child, `text-${index}`);
		}
		return renderNode(child, `child-${index}`);
	});
}

function renderTextNode(node: LexicalNode, key: string): React.ReactNode {
	let text: React.ReactNode = node.text || '';
	const format = node.format || 0;

	if (format) {
		if (format & 1) {
			// Bold
			text = <strong key={key}>{text}</strong>;
		}
		if (format & 2) {
			// Italic
			text = <em key={key}>{text}</em>;
		}
		if (format & 4) {
			// Strikethrough
			text = <s key={key}>{text}</s>;
		}
		if (format & 8) {
			// Underline
			text = <u key={key}>{text}</u>;
		}
		if (format & 16) {
			// Code
			text = (
				<code key={key} className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm'>
					{text}
				</code>
			);
		}
	}

	return text;
}

function renderBlock(node: LexicalNode, key: string): React.ReactNode {
	const fields = node.fields as Record<string, unknown> | undefined;
	const blockType = fields?.blockType as string;

	// Handle different block types based on your CMS configuration
	switch (blockType) {
		case 'banner': {
			const content = fields?.content as SerializedEditorState | undefined;
			return (
				<div key={key} className='bg-primary/10 border-l-4 border-primary p-4 my-4'>
					{content && renderLexicalContent(content)}
				</div>
			);
		}

		case 'code': {
			const code = fields?.code as string;
			return (
				<pre key={key} className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4'>
					<code>{code || ''}</code>
				</pre>
			);
		}

		case 'mediaBlock': {
			const media = fields?.media as Record<string, unknown> | undefined;
			const caption = fields?.caption as string | undefined;
			if (media?.url) {
				return (
					<figure key={key} className='my-8 w-full'>
						<CMSImage
							src={media.url as string}
							alt={(media.alt as string) || ''}
							width={(media.width as number) || 800}
							height={(media.height as number) || 600}
							className='w-full rounded-lg'
						/>
						{caption && <figcaption className='text-center text-sm text-gray-500 mt-2'>{caption}</figcaption>}
					</figure>
				);
			}
			return null;
		}

		default:
			return null;
	}
}
