'use client';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import links from '@/lib/links';

const companies = [
	{ name: 'GEM Hospital', logo: '/company-logos/gem-hospital.png' },
	{ name: 'Kauvery Hospital', logo: '/company-logos/kauvery-hospital.png' },
	{ name: 'Spectra Medical', logo: '/company-logos/spectra-medical.png' },
	{ name: 'Vecura', logo: '/company-logos/vecura.png' },
	{ name: 'Scans World', logo: '/company-logos/scans-world.png' },
	{ name: '2050 Healthcare', logo: '/company-logos/2050-healthcare.png' }
];

export default function CompanyLogos() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true }, [AutoScroll({ speed: 0.5 })]);

	const onPointerDown = useCallback(() => {
		emblaApi?.plugins().autoScroll?.stop();
	}, [emblaApi]);

	const onPointerUp = useCallback(() => {
		emblaApi?.plugins().autoScroll?.play();
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		emblaApi.on('pointerDown', onPointerDown);
		emblaApi.on('pointerUp', onPointerUp);
	}, [emblaApi, onPointerDown, onPointerUp]);

	return (
		<section className='w-full bg-background-600 py-12'>
			<div className='max-w-7xl mx-auto px-4 flex flex-col gap-8'>
				<div className='flex items-center gap-4'>
					<p className='text-base font-medium text-foreground-600'>Find jobs from leading healthcare organizations</p>
				</div>
				<div className='relative overflow-hidden'>
					<div className='absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background-600 to-transparent z-10 pointer-events-none' />
					<div className='absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background-600 to-transparent z-10 pointer-events-none' />
					<div className='embla' ref={emblaRef}>
						<div className='gap-x-2 flex'>
							{[...companies, ...companies].map((company, index) => (
								<div
									key={`${company.name}-${index}`}
									className='flex-[0_0_150px] sm:flex-[0_0_200px] flex items-center justify-center h-16 mx-4'
								>
									<Image
										src={company.logo}
										alt={company.name}
										width={100}
										height={50}
										className='object-contain'
										loading='eager'
										title={company.name}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<Link
					href={links.organizations}
					className='flex items-center gap-1 text-sm text-foreground-500 font-medium hover:text-primary-600 transition-colors mt-4'
				>
					View all Organizations <ArrowRight className='w-3 h-3' strokeWidth={3} />
				</Link>
			</div>
		</section>
	);
}
