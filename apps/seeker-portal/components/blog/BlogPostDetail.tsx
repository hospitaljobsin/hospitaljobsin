'use client';

import { Button, Chip } from '@heroui/react';
import { format } from 'date-fns';
import { ArrowLeft, CalendarDays, Clock, Facebook, Linkedin, Share2, Twitter, User } from 'lucide-react';
import Link from 'next/link';
import type { PayloadPost } from '@/types/payload';
import { CMSImage } from './CMSImage';
import { LexicalContent } from './LexicalContent';
import { PostTableOfContents } from './PostTableOfContents';

interface BlogPostDetailProps {
	post: PayloadPost;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
	const publishedDate = post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : null;
	const authors = post.populatedAuthors || [];

	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
	const shareTitle = post.title;

	const handleShare = (platform: string) => {
		const urls = {
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
		};

		window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
	};

	return (
		<div className='h-full w-full'>
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
							{/* On This Page */}
							{post.content && (
								<div className='bg-background border border-default-200 rounded-lg p-6'>
									<h3 className='text-lg font-medium mb-4 text-foreground-600'>On This Page</h3>
									<nav>
										<PostTableOfContents content={post.content} />
									</nav>
								</div>
							)}

							{/* Share Section */}
							<div className='px-4'>
								<h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-foreground-600'>
									<Share2 className='w-4 h-4' />
									Share This Post
								</h3>
								<div className='flex gap-3 text-foreground-600'>
									<Button isIconOnly variant='flat' color='default' onPress={() => handleShare('twitter')} aria-label='Share on Twitter'>
										<Twitter className='w-5 h-5' />
									</Button>
									<Button isIconOnly variant='flat' color='default' onPress={() => handleShare('facebook')} aria-label='Share on Facebook'>
										<Facebook className='w-5 h-5' />
									</Button>
									<Button isIconOnly variant='flat' color='default' onPress={() => handleShare('linkedin')} aria-label='Share on LinkedIn'>
										<Linkedin className='w-5 h-5' />
									</Button>
								</div>
							</div>
						</div>
					</aside>
					{/* Main Content */}
					<article className='lg:col-span-8 lg:order-1'>
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

						{/* Mobile On This Page - Shows after hero image */}
						{post.content && (
							<div className='lg:hidden bg-background border border-default-200 rounded-lg p-6 mb-8'>
								<h3 className='text-lg font-medium mb-4 text-foreground-600'>On This Page</h3>
								<nav>
									<PostTableOfContents content={post.content} />
								</nav>
							</div>
						)}

						{/* Content */}
						{post.content && (
							<div className='prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-32 prose-headings:font-semibold prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-default-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-default-900 prose-strong:font-semibold prose-code:text-primary prose-code:bg-default-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-default-100 prose-pre:border prose-pre:border-default-200 prose-img:rounded-lg prose-img:shadow-md'>
								<LexicalContent content={post.content} />
							</div>
						)}

						{/* Author Bio Section */}
						{authors.length > 0 && (
							<div className='mt-12 pt-8 border-t border-default-200'>
								<h3 className='text-lg font-medium mb-4 text-foreground-600'>About the Author{authors.length > 1 ? 's' : ''}</h3>
								<div className='space-y-4'>
									{authors.map(author => {
										console.log('Author data:', author);
										const hasAvatar = author.avatar && typeof author.avatar === 'object' && author.avatar.url;

										return (
											<div key={author.id} className='flex items-center gap-4 bg-default-100 rounded-lg'>
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
							<h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-foreground-600'>
								<Share2 className='w-5 h-5' />
								Share This Post
							</h3>
							<div className='flex gap-2'>
								<Button isIconOnly variant='flat' color='default' onPress={() => handleShare('twitter')} aria-label='Share on Twitter'>
									<Twitter className='w-5 h-5' />
								</Button>
								<Button isIconOnly variant='flat' color='default' onPress={() => handleShare('facebook')} aria-label='Share on Facebook'>
									<Facebook className='w-5 h-5' />
								</Button>
								<Button isIconOnly variant='flat' color='default' onPress={() => handleShare('linkedin')} aria-label='Share on LinkedIn'>
									<Linkedin className='w-5 h-5' />
								</Button>
							</div>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}
