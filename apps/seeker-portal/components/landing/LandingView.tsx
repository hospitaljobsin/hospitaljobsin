'use client';
import { Button } from '@heroui/react';
import { ArrowRight, ChevronLeft, ChevronRight, SparklesIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { SiteStatsFragment$key } from '@/__generated__/SiteStatsFragment.graphql';
import links from '@/lib/links';
import LandingHeaderSkeleton from '../layout/LandingHeaderSkeleton';
import AboutAndMapSection from './AboutAndMapSection';
import CompanyLogos from './CompanyLogos';
import type { JobListHandle } from './JobListClientComponent';
import JobListSkeleton from './JobListSkeleton';
import { LandingSearchController } from './LandingSearchController';
import SiteStats from './SiteStats';

const LandingHeaderClientComponent = dynamic(() => import('../layout/LandingHeaderClientComponent'), {
	ssr: false,
	loading() {
		return <LandingHeaderSkeleton />;
	}
});

const JobListClientComponent = dynamic(() => import('./JobListClientComponent'), {
	ssr: false,
	loading() {
		return <JobListSkeleton />;
	}
});

export default function LandingView({ siteStatsData }: { siteStatsData: SiteStatsFragment$key }) {
	const jobListRef = useRef<JobListHandle>(null);

	return (
		<div className='w-full flex flex-col bg-background-600 h-full'>
			{/* Hero Section */}
			<div className='relative bg-gradient-to-br from-primary-600 via-primary-400 to-primary-300 flex flex-col justify-center items-center w-full'>
				<LandingHeaderClientComponent />
				{/* Background SVG or Image Placeholder */}
				<div className='absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none z-0'>
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: messes up with nextjs page title */}
					<svg viewBox='0 0 1440 320' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
						<path
							fill='#fff'
							fillOpacity='0.2'
							d='M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'
						/>
					</svg>
				</div>
				{/* Main content: text left, image right */}
				<div className='relative z-10 flex flex-col md:flex-row md:items-end text-center md:text-left gap-8 pt-8 px-4 max-w-7xl w-full h-full'>
					{/* Left: Text and Search */}
					<div className='flex-1 flex flex-col items-center md:items-start gap-6 pb-8'>
						<h1 className='text-4xl font-medium tracking-tight text-primary-foreground drop-shadow-lg hidden md:block'>
							Empowering <span className='text-accent-400'>Healthcare Heroes</span>
							<br />
							to Find Their Next <span className='text-accent-400'>Opportunity</span>
						</h1>
						<p className='text-lg sm:text-xl text-primary-foreground/90 font-medium max-w-xl mx-auto md:mx-0 hidden md:block'>
							Discover life-changing roles at top hospitals and clinics. Your next mission starts here.
						</p>
						<div className='w-full flex flex-col items-center md:items-start gap-6'>
							<LandingSearchController />
							<SiteStats rootQuery={siteStatsData} />
						</div>
					</div>
					{/* Right: Doctor Image */}
					<div className='flex-1 md:flex items-end w-auto h-[450px] hidden relative'>
						<Image
							src='/hero-model.png'
							alt='Group of doctors smiling, representing healthcare professionals'
							className='w-auto h-full max-w-full object-cover object-bottom absolute left-0 top-0 z-10'
							loading='eager'
							priority
							width={1000}
							height={1000}
						/>
						<Image
							src='/hero-model-2.png'
							alt='Group of doctors smiling, representing healthcare professionals'
							className='w-auto h-full max-w-full object-cover object-bottom absolute drop-shadow-lg left-72 z-20 hidden xl:block'
							loading='eager'
							priority
							width={1000}
							height={1000}
						/>
					</div>
				</div>
			</div>

			<CompanyLogos />

			<AboutAndMapSection />

			{/* Trending Jobs Section */}
			<div className='py-8 sm:py-16 flex flex-col gap-8 max-w-7xl w-full px-4 sm:px-5 mx-auto bg-background-600'>
				<div className='w-full flex flex-col gap-4 items-center justify-center'>
					<div className='flex flex-col gap-4 w-full py-8'>
						<div className='flex items-center justify-between w-full'>
							<div className='flex items-center gap-4'>
								<SparklesIcon className='text-foreground-600 w-7 h-7' />
								<h2 className='text-lg font-medium text-foreground-600 tracking-tight'>Latest Jobs</h2>
							</div>
							<div className='hidden md:flex items-center gap-2'>
								<Button isIconOnly size='sm' variant='bordered' className='bg-background' onPress={() => jobListRef.current?.scrollPrev()}>
									<ChevronLeft size={16} />
								</Button>
								<Button isIconOnly size='sm' variant='bordered' className='bg-background' onPress={() => jobListRef.current?.scrollNext()}>
									<ChevronRight size={16} />
								</Button>
							</div>
						</div>
						<h3 className='text-foreground-500 text-sm sm:text-base font-medium tracking-tight'>Latest Healthcare Jobs Posted</h3>
					</div>
					<JobListClientComponent ref={jobListRef} />
				</div>
				<Link href={links.search()} className='flex items-center gap-2 text-lg text-foreground-600 font-medium -mt-2'>
					View all jobs <ArrowRight className='w-4 h-4' strokeWidth={3} />
				</Link>
			</div>
		</div>
	);
}
