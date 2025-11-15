import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';

interface LexicalToMarkdownResult {
	markdown: string;
	headings: Array<{ level: number; text: string; id: string }>;
}

export function lexicalToMarkdown(content: SerializedEditorState): LexicalToMarkdownResult {
	const headings: Array<{ level: number; text: string; id: string }> = [];
	const processNode = (node: SerializedLexicalNode): string => {
		if (!node) return '';

		const type = node.type;

		// Handle text nodes
		if (type === 'text') {
			const textNode = node as any;
			let text = textNode.text || '';

			if (textNode.format) {
				if (textNode.format & 1) text = `**${text}**`; // bold
				if (textNode.format & 2) text = `*${text}*`; // italic
				if (textNode.format & 8) text = `\`${text}\``; // code
			}

			return text;
		}

		// Handle paragraph nodes
		if (type === 'paragraph') {
			const children = (node as any).children || [];
			return children.map(processNode).join('') + '\n\n';
		}

		// Handle heading nodes
		if (type === 'heading') {
			const headingNode = node as any;
			const level = headingNode.tag?.replace('h', '') || '1';
			const children = headingNode.children || [];
			const text = children.map(processNode).join('');
			const id = text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
			headings.push({ level: Number(level), text, id });
			return '#'.repeat(Number(level)) + ' ' + text + '\n\n';
		}

		// Handle list nodes
		if (type === 'list') {
			const listNode = node as any;
			const children = listNode.children || [];
			return children.map(processNode).join('') + '\n';
		}

		// Handle list item nodes
		if (type === 'listitem') {
			const listItemNode = node as any;
			const children = listItemNode.children || [];
			const text = children.map(processNode).join('');
			return `- ${text}\n`;
		}

		// Handle quote nodes
		if (type === 'quote') {
			const quoteNode = node as any;
			const children = quoteNode.children || [];
			const text = children.map(processNode).join('');
			return `> ${text}\n\n`;
		}

		// Handle code block nodes
		if (type === 'code') {
			const codeNode = node as any;
			const children = codeNode.children || [];
			const text = children.map(processNode).join('');
			return `\`\`\`\n${text}\n\`\`\`\n\n`;
		}

		// Handle link nodes
		if (type === 'link') {
			const linkNode = node as any;
			const children = linkNode.children || [];
			const text = children.map(processNode).join('');
			return `[${text}](${linkNode.url || '#'})`;
		}

		// Handle image nodes
		if (type === 'image') {
			const imageNode = node as any;
			const alt = imageNode.altText || 'Image';
			const src = imageNode.src || '';
			return `![${alt}](${src})\n\n`;
		}

		// Handle block nodes (mediaBlock, code, banner, etc.)
		if (type === 'block') {
			const blockNode = node as any;
			const fields = blockNode.fields || {};

			// Handle media blocks
			if (fields.blockType === 'mediaBlock' && fields.media) {
				const media = fields.media;
				if (typeof media === 'object' && media.url) {
					const alt = media.alt || fields.blockName || 'Image';
					return `![${alt}](${media.url})\n\n`;
				}
			}

			// Handle code blocks
			if (fields.blockType === 'code' && fields.code) {
				const language = fields.language || '';
				return `\`\`\`${language}\n${fields.code}\n\`\`\`\n\n`;
			}

			// Handle banner blocks (render nested content)
			if (fields.blockType === 'banner' && fields.content) {
				const bannerResult = lexicalToMarkdown(fields.content);
				return `> ${bannerResult.markdown.trim().replace(/\n/g, '\n> ')}\n\n`;
			}

			// Handle FAQ blocks
			if (fields.blockType === 'faq' && fields.faqs) {
				const faqs = fields.faqs as Array<{ question: string; answer: string }>;
				return faqs.map(faq => `**Q: ${faq.question}**\n\nA: ${faq.answer}\n`).join('\n') + '\n';
			}

			return '';
		}

		// Handle children for other node types
		const children = (node as any).children;
		if (Array.isArray(children)) {
			return children.map(processNode).join('');
		}

		return '';
	};

	const root = content.root;
	if (!root || !root.children) return { markdown: '', headings: [] };

	const markdown = root.children.map(processNode).join('');
	return { markdown, headings };
}
