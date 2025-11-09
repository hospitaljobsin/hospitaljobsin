'use client';

import { Button, Chip, Link as HeroUILink } from '@heroui/react';
import { format } from 'date-fns';
import type { SerializedEditorState } from 'lexical';
import { ArrowLeft, CalendarDays, Clock, Facebook, Linkedin, Share2, Twitter, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PayloadPost } from '@/types/payload';
import { CMSImage } from './CMSImage';
import { LexicalContent } from './LexicalContent';

interface BlogPostDetailProps {
	post: PayloadPost;
}

interface TableOfContentsItem {
	id: string;
	text: string;
	level: number;
}

type LexicalNode = Record<string, unknown> & {
	type: string;
	children?: LexicalNode[];
	text?: string;
	tag?: string;
};

function extractHeadings(content: SerializedEditorState): TableOfContentsItem[] {
	const headings: TableOfContentsItem[] = [];

	function traverseNodes(nodes: LexicalNode[]): void {
		for (const node of nodes) {
			if (node.type === 'heading') {
				const level = Number.parseInt(node.tag as string, 10) || 2;
				const text = extractTextFromNode(node);
				if (text) {
					const id = text
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/(^-|-$)/g, '');
					headings.push({ id, text, level });
				}
			}
			if (node.children && Array.isArray(node.children)) {
				traverseNodes(node.children);
			}
		}
	}

	if (content?.root?.children) {
		traverseNodes(content.root.children as LexicalNode[]);
	}

	return headings;
}

function extractTextFromNode(node: LexicalNode): string {
	if (node.text) {
		return node.text;
	}
	if (node.children && Array.isArray(node.children)) {
		return node.children.map(child => extractTextFromNode(child)).join('');
	}
	return '';
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
	const publishedDate = post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : null;
	const authors = post.populatedAuthors || [];
	const [activeId, setActiveId] = useState<string>('');
	const [showShareMenu, setShowShareMenu] = useState(false);
	const tableOfContents = post.content ? extractHeadings(post.content) : [];

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{
				rootMargin: '-80px 0px -66%',
				threshold: 0.5
			}
		);

		const headings = document.querySelectorAll('h2[id], h3[id], h4[id]');
		for (const heading of headings) {
			observer.observe(heading);
		}

		return () => observer.disconnect();
	}, []);

	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareTitle = post.title;

	const handleShare = (platform: string) => {
		const urls = {
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
		};

		window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
		setShowShareMenu(false);
	};

	return (
		<div className='h-full'>
			{/* Back to Blog Header */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 border-b border-divider'>
				<Link href='/blog' className='inline-flex items-center gap-2 text-default-600 hover:text-primary transition-colors'>
					<ArrowLeft className='w-4 h-4' />
					<span className='text-sm font-medium'>Back to blog home</span>
				</Link>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
					{/* Sidebar - Desktop only */}
					<aside className='hidden lg:block lg:col-span-4 lg:order-2'>
						<div className='lg:sticky lg:top-24 space-y-6'>
							{/* Table of Contents */}
							{tableOfContents.length > 0 && (
								<div className='bg-background border border-default-200 rounded-lg p-6'>
									<h3 className='text-lg font-semibold mb-4'>Table of contents</h3>
									<nav>
										<ul className='space-y-2'>
											{tableOfContents.map(item => (
												<li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
													<HeroUILink
														href={`#${item.id}`}
														color={activeId === item.id ? 'primary' : 'foreground'}
														className={`text-sm hover:text-primary transition-colors block py-1 ${
															activeId === item.id ? 'font-semibold border-l-2 border-primary pl-2 -ml-2 bg-primary/5' : ''
														}`}
													>
														{item.text}
													</HeroUILink>
												</li>
											))}
										</ul>
									</nav>
								</div>
							)}

							{/* Share Section */}
							<div className='bg-background border border-default-200 rounded-lg p-6'>
								<h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
									<Share2 className='w-5 h-5' />
									Share
								</h3>
								<div className='flex flex-col gap-2'>
									<Button
										variant='flat'
										color='default'
										startContent={<Twitter className='w-4 h-4' />}
										onPress={() => handleShare('twitter')}
										className='justify-start'
									>
										Share on Twitter
									</Button>
									<Button
										variant='flat'
										color='default'
										startContent={<Facebook className='w-4 h-4' />}
										onPress={() => handleShare('facebook')}
										className='justify-start'
									>
										Share on Facebook
									</Button>
									<Button
										variant='flat'
										color='default'
										startContent={<Linkedin className='w-4 h-4' />}
										onPress={() => handleShare('linkedin')}
										className='justify-start'
									>
										Share on LinkedIn
									</Button>
								</div>
							</div>
						</div>
					</aside>

					{/* Main Content */}
					<article className='lg:col-span-8 lg:order-1'>
						{/* Categories */}
						{post.categories && post.categories.length > 0 && (
							<div className='flex gap-2 flex-wrap mb-4'>
								{post.categories.map(category => (
									<Chip key={category.id} color='primary' variant='flat' size='sm'>
										{category.title}
									</Chip>
								))}
							</div>
						)}

						{/* Title */}
						<h1 className='text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-default-900'>{post.title}</h1>

						{/* Author and Date Info */}
						<div className='flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-6 border-b border-default-200'>
							<div className='flex items-center gap-3 flex-wrap'>
								{authors.length > 0 &&
									authors.map(author => {
										const hasAvatar = author.avatar && typeof author.avatar === 'object' && author.avatar.url;

										return (
											<div key={author.id} className='flex items-center gap-2'>
												{hasAvatar && author.avatar ? (
													<div className='w-8 h-8 rounded-full overflow-hidden'>
														<CMSImage
															src={author.avatar.url as string}
															alt={author.avatar.alt || author.name}
															width={32}
															height={32}
															className='object-cover w-full h-full'
														/>
													</div>
												) : (
													<div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
														<User className='w-4 h-4 text-primary' />
													</div>
												)}
												<span className='text-sm font-medium text-default-700'>{author.name}</span>
											</div>
										);
									})}
							</div>
							{publishedDate && (
								<div className='flex items-center gap-2 text-sm text-default-600'>
									<CalendarDays className='w-4 h-4' />
									<span>{publishedDate}</span>
								</div>
							)}
							{post.readingTime && (
								<div className='flex items-center gap-2 text-sm text-default-600'>
									<Clock className='w-4 h-4' />
									<span>{post.readingTime} min read</span>
								</div>
							)}
						</div>

						{/* Hero Image */}
						{post.heroImage?.url && (
							<div className='relative w-full h-[400px] mb-8 rounded-lg overflow-hidden'>
								<CMSImage
									src={post.heroImage.url}
									alt={post.heroImage.alt || post.title}
									fill
									className='object-cover'
									sizes='(max-width: 1200px) 100vw, 1200px'
									priority
								/>
							</div>
						)}

						{/* Mobile Table of Contents - Shows after hero image */}
						{tableOfContents.length > 0 && (
							<div className='lg:hidden bg-background border border-default-200 rounded-lg p-6 mb-8'>
								<h3 className='text-lg font-semibold mb-4'>Table of contents</h3>
								<nav>
									<ul className='space-y-2'>
										{tableOfContents.map(item => (
											<li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
												<HeroUILink
													href={`#${item.id}`}
													color={activeId === item.id ? 'primary' : 'foreground'}
													className={`text-sm hover:text-primary transition-colors block py-1 ${
														activeId === item.id ? 'font-semibold border-l-2 border-primary pl-2 -ml-2 bg-primary/5' : ''
													}`}
												>
													{item.text}
												</HeroUILink>
											</li>
										))}
									</ul>
								</nav>
							</div>
						)}

						{/* Content */}
						{post.content && (
							<div className='prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-default-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-default-900 prose-strong:font-semibold prose-code:text-primary prose-code:bg-default-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-default-100 prose-pre:border prose-pre:border-default-200 prose-img:rounded-lg prose-img:shadow-md'>
								<LexicalContent content={post.content} />
							</div>
						)}

						{/* Author Bio Section */}
						{authors.length > 0 && (
							<div className='mt-12 pt-8 border-t border-default-200'>
								<h3 className='text-lg font-medium mb-4'>About the Author{authors.length > 1 ? 's' : ''}</h3>
								<div className='space-y-4'>
									{authors.map(author => {
										console.log('Author data:', author);
										const hasAvatar = author.avatar && typeof author.avatar === 'object' && author.avatar.url;

										return (
											<div key={author.id} className='flex items-start gap-4 bg-default-100 rounded-lg'>
												<div className='flex-shrink-0'>
													{hasAvatar && author.avatar ? (
														<div className='w-16 h-16 rounded-full overflow-hidden'>
															<CMSImage
																src={author.avatar.url as string}
																alt={author.avatar.alt || author.name}
																width={64}
																height={64}
																className='object-cover w-full h-full'
															/>
														</div>
													) : (
														<div className='w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center'>
															<User className='w-8 h-8 text-primary' />
														</div>
													)}
												</div>
												<div className='flex-1'>
													<h4 className='font-medium text-default-900 mb-1'>{author.name}</h4>
													{author.about && <p className='text-sm text-default-600'>{author.about}</p>}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Mobile Share Section */}
						<div className='lg:hidden mt-8 pt-6 border-t border-default-200'>
							<h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
								<Share2 className='w-5 h-5' />
								Share
							</h3>
							<div className='flex flex-col gap-2'>
								<Button
									variant='flat'
									color='default'
									startContent={<Twitter className='w-4 h-4' />}
									onPress={() => handleShare('twitter')}
									className='justify-start'
								>
									Share on Twitter
								</Button>
								<Button
									variant='flat'
									color='default'
									startContent={<Facebook className='w-4 h-4' />}
									onPress={() => handleShare('facebook')}
									className='justify-start'
								>
									Share on Facebook
								</Button>
								<Button
									variant='flat'
									color='default'
									startContent={<Linkedin className='w-4 h-4' />}
									onPress={() => handleShare('linkedin')}
									className='justify-start'
								>
									Share on LinkedIn
								</Button>
							</div>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}
