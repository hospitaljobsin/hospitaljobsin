'use client';

import { Button, Card, CardBody, Link } from '@heroui/react';
import { BookOpen, Rss, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
import LandingHeaderSkeleton from '@/components/layout/LandingHeaderSkeleton';

const LandingHeaderClientComponent = dynamic(() => import('@/components/layout/LandingHeaderClientComponent'), {
	ssr: false,
	loading() {
		return <LandingHeaderSkeleton />;
	}
});
import { env } from '@/lib/env/client';
import links from '@/lib/links';

export default function FeedPage() {
	const feedUrl = `${env.NEXT_PUBLIC_URL}${links.blogFeed}`;

	return (
		<div className='w-full min-h-screen flex flex-col relative bg-gradient-to-br from-primary-600 via-primary-400 to-primary-300'>
			<div className='absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none overflow-hidden'>
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative */}
				<svg
					viewBox='0 0 1440 1024'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='absolute w-full h-full'
					preserveAspectRatio='xMidYMid slice'
				>
					<path
						fill='#fff'
						fillOpacity='0.15'
						d='M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,250.7C672,256,768,288,864,293.3C960,299,1056,277,1152,250.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
					/>
					<path
						fill='#fff'
						fillOpacity='0.1'
						d='M0,512L48,528C96,544,192,576,288,586.7C384,597,480,587,576,560C672,533,768,491,864,480C960,469,1056,491,1152,512C1248,533,1344,555,1392,565.3L1440,576L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
					/>
					<path
						fill='#fff'
						fillOpacity='0.08'
						d='M0,768L48,757.3C96,747,192,725,288,730.7C384,736,480,768,576,778.7C672,789,768,779,864,757.3C960,736,1056,704,1152,704C1248,704,1344,736,1392,752L1440,768L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
					/>
				</svg>
			</div>
			<div className='relative z-10'>
				<LandingHeaderClientComponent />
			</div>
			<div className='relative z-10 container mx-auto px-4 py-12 max-w-4xl'>
				<div className='space-y-8'>
					<div className='text-center space-y-4'>
						<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4'>
							<Rss className='w-8 h-8 text-primary' />
						</div>
						<h1 className='text-xl sm:text-4xl font-medium text-white drop-shadow-lg'>Subscribe to Our RSS Feed</h1>
						<p className='text-lg text-white/90 max-w-2xl mx-auto'>
							Get the latest healthcare career insights, industry trends, and job market updates delivered directly to your favorite feed
							reader.
						</p>
					</div>

					<Card>
						<CardBody className='p-6 space-y-4'>
							<h2 className='text-xl font-medium text-default-900'>What is RSS?</h2>
							<p className='text-default-700'>
								RSS (Really Simple Syndication) is a way to stay updated with your favorite websites without having to visit them
								individually. Think of it as a personalized news feed that brings all your favorite content to one place.
							</p>
						</CardBody>
					</Card>

					<Card>
						<CardBody className='p-6 space-y-4'>
							<div className='flex items-center gap-2'>
								<BookOpen className='w-5 h-5 text-primary' />
								<h2 className='text-xl font-medium text-default-900'>How to Subscribe</h2>
							</div>
							<ol className='space-y-3 text-default-700 list-decimal list-inside'>
								<li>
									<span className='font-medium'>Choose a feed reader app</span> - Popular options include Feedly, Inoreader, or NewsBlur
								</li>
								<li>
									<span className='font-medium'>Copy our feed URL</span> - Use the link below
								</li>
								<li>
									<span className='font-medium'>Add it to your reader</span> - Look for an "Add Feed" or "Subscribe" button in your app
								</li>
								<li>
									<span className='font-medium'>Enjoy automatic updates</span> - New posts will appear in your feed reader automatically
								</li>
							</ol>
						</CardBody>
					</Card>

					<Card className='bg-primary/5 border-primary/20'>
						<CardBody className='p-6 space-y-4'>
							<h3 className='text-lg font-medium text-primary-foreground'>Our RSS Feed URL</h3>
							<div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center'>
								<code className='flex-1 px-4 py-3 bg-default-100 rounded-lg text-sm break-all'>{feedUrl}</code>
								<Button
									as={Link}
									href={feedUrl}
									color='primary'
									variant='solid'
									className='whitespace-nowrap'
									startContent={<Rss className='w-4 h-4' />}
								>
									Open Feed
								</Button>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardBody className='p-6 space-y-4'>
							<div className='flex items-center gap-2'>
								<Smartphone className='w-5 h-5 text-primary' />
								<h2 className='text-xl font-medium text-default-900'>Recommended Feed Readers</h2>
							</div>
							<div className='grid sm:grid-cols-2 gap-4'>
								<div className='p-4 border border-default-200 rounded-lg'>
									<h3 className='font-medium text-default-900 mb-2'>Feedly</h3>
									<p className='text-sm text-default-600 mb-3'>Popular and user-friendly, available on web and mobile</p>
									<Button as={Link} href='https://feedly.com' target='_blank' size='sm' variant='flat'>
										Visit Feedly
									</Button>
								</div>
								<div className='p-4 border border-default-200 rounded-lg'>
									<h3 className='font-medium text-default-900 mb-2'>Inoreader</h3>
									<p className='text-sm text-default-600 mb-3'>Feature-rich with powerful filtering options</p>
									<Button as={Link} href='https://www.inoreader.com' target='_blank' size='sm' variant='flat'>
										Visit Inoreader
									</Button>
								</div>
								<div className='p-4 border border-default-200 rounded-lg'>
									<h3 className='font-medium text-default-900 mb-2'>NewsBlur</h3>
									<p className='text-sm text-default-600 mb-3'>Open-source with social features</p>
									<Button as={Link} href='https://newsblur.com' target='_blank' size='sm' variant='flat'>
										Visit NewsBlur
									</Button>
								</div>
								<div className='p-4 border border-default-200 rounded-lg'>
									<h3 className='font-medium text-default-900 mb-2'>The Old Reader</h3>
									<p className='text-sm text-default-600 mb-3'>Simple and reminiscent of classic Google Reader</p>
									<Button as={Link} href='https://theoldreader.com' target='_blank' size='sm' variant='flat'>
										Visit The Old Reader
									</Button>
								</div>
							</div>
						</CardBody>
					</Card>

					<div className='text-center pt-4'>
						<p className='text-white/90'>
							Need help?{' '}
							<Link href='mailto:support@hospitaljobs.in' className='text-white font-medium underline'>
								Contact us
							</Link>{' '}
							and we'll be happy to assist you.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
