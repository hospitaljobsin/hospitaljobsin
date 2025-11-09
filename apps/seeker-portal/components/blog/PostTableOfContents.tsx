'use client';

import { Link as HeroUILink } from '@heroui/react';
import type { SerializedEditorState } from 'lexical';
import { ArrowRight, CircleSmall } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type LexicalNode = Record<string, unknown> & {
	type: string;
	children?: LexicalNode[];
	text?: string;
	tag?: string;
};

type Props = {
	content: SerializedEditorState;
	className?: string;
};

export function PostTableOfContents({ className, content }: Props) {
	const [activeId, setActiveId] = useState<string>();
	const activeHeadingRef = useRef<Record<string, IntersectionObserverEntry>>({});

	// Helper function to extract text from a node
	const extractText = (node: LexicalNode): string => {
		if (node.text) return node.text;
		if (node.children && Array.isArray(node.children)) {
			return node.children.map(child => extractText(child as LexicalNode)).join('');
		}
		return '';
	};

	const onHeadingClick = (child: LexicalNode) => {
		const text = extractText(child);
		if (!text) return;

		const id = text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
		const element = document.getElementById(id);

		if (element) {
			// Calculate the offset - accounting for the sticky header and additional spacing
			// The header is typically around 64-80px, plus we want some breathing room
			const headerOffset = 120;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	};

	useEffect(() => {
		// Only enable active heading tracking on desktop (screens wider than 1024px)
		const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

		if (!isDesktop) {
			return;
		}

		let observer: IntersectionObserver | null = null;
		let retryCount = 0;
		const maxRetries = 10;

		const setupIntersectionObserver = () => {
			const headingElements: Element[] = Array.from(document.querySelectorAll('article h1, article h2, article h3'));

			// Check if headings have IDs
			const headingsWithIds = headingElements.filter(el => el.id);

			if (headingsWithIds.length === 0) {
				return false;
			}

			const callback: IntersectionObserverCallback = headings => {
				activeHeadingRef.current = headings.reduce((map: Record<string, IntersectionObserverEntry>, headingElement) => {
					map[headingElement.target.id] = headingElement;
					return map;
				}, activeHeadingRef.current);

				const visibleHeadings: IntersectionObserverEntry[] = [];
				for (const key of Object.keys(activeHeadingRef.current)) {
					const headingElement = activeHeadingRef.current[key];
					if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
				}

				const getIndexFromId = (id: string) => headingsWithIds.findIndex(heading => heading.id === id);

				if (visibleHeadings.length === 1) {
					setActiveId(visibleHeadings[0].target.id);
				} else if (visibleHeadings.length > 1) {
					const sortedVisibleHeadings = visibleHeadings.sort((a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id));
					setActiveId(sortedVisibleHeadings[0].target.id);
				}
			};

			observer = new IntersectionObserver(callback, {
				rootMargin: '-120px 0px -40% 0px'
			});

			for (const element of headingsWithIds) {
				observer.observe(element);
			}

			return true;
		};

		// Try to set up observer with retries
		const trySetup = () => {
			const success = setupIntersectionObserver();

			if (!success && retryCount < maxRetries) {
				retryCount++;
				setTimeout(trySetup, 100);
			}
		};

		trySetup();

		return () => {
			observer?.disconnect();
		};
	}, [content]);

	if (!content?.root?.children) return null;

	// Recursively collect all heading nodes from the content tree
	const collectHeadings = (nodes: unknown[]): LexicalNode[] => {
		const headings: LexicalNode[] = [];

		for (const child of nodes) {
			const node = child as LexicalNode;

			// Check if it's a heading node with tag 'h1', 'h2' or 'h3'
			if (node.type === 'heading' && (node.tag === 'h1' || node.tag === 'h2' || node.tag === 'h3')) {
				headings.push(node);
			}

			// Recursively check children
			if (node.children && Array.isArray(node.children)) {
				headings.push(...collectHeadings(node.children));
			}
		}

		return headings;
	};

	const headings = collectHeadings(content.root.children);

	return (
		<ul className={`list-none space-y-2 ${className || ''}`}>
			{headings.map(node => {
				const text = extractText(node);
				if (!text) return null;

				const id = text
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, '');
				// Extract the level number from the tag (e.g., 'h2' -> 2)
				const level = Number.parseInt((node.tag as string)?.replace('h', '') || '2', 10);
				// Calculate indent based on h1 being the base level (0 indent for h1, 12px for h2, 24px for h3)
				const indent = (level - 1) * 12;
				const isActive = activeId === id;

				// Create a more unique key to avoid the index-as-key warning
				const uniqueKey = `${id}-${level}-${text.slice(0, 20)}`;

				return (
					<li key={uniqueKey} style={{ paddingLeft: `${indent}px` }}>
						<HeroUILink
							href={`#${id}`}
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								onHeadingClick(node);
							}}
							color={isActive ? 'primary' : 'foreground'}
							className={`text-sm transition-colors py-1 hover:text-primary flex items-center gap-1 ${
								isActive ? 'font-semibold border-l-2 border-primary pl-2 -ml-2 bg-primary/5' : ''
							}`}
						>
							{isActive ? <ArrowRight className='w-3.5 h-3.5 flex-shrink-0' /> : <CircleSmall className='w-3.5 h-3.5 flex-shrink-0' />}
							<span>{text}</span>
						</HeroUILink>
					</li>
				);
			})}
		</ul>
	);
}
