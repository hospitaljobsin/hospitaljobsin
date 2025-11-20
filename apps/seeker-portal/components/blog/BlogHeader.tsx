'use client';

import { Button } from '@heroui/react';
import { Rss } from 'lucide-react';
import Link from 'next/link';
import links from '@/lib/links';

export function BlogHeader() {
	return (
		<div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
			<div>
				<h1 className='text-xl sm:text-4xl font-medium tracking-tight text-foreground-600 mb-2'>Hospital Pulse</h1>
				<p className='text-xs sm:text-lg text-default-500'>
					Career insights, industry trends, and expert advice for healthcare professionals and recruiters
				</p>
			</div>
			<Button as={Link} href={links.feed} color='primary' variant='flat' startContent={<Rss className='w-4 h-4' />}>
				Subscribe via RSS
			</Button>
		</div>
	);
}
