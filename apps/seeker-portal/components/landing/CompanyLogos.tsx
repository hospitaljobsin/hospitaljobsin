'use client';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';

const companies = [
	{ name: 'GEM Hospital', logo: '/company-logos/gem-hospital.png' },
	{ name: 'Kauvery Hospital', logo: '/company-logos/kauvery-hospital.png' },
	{ name: 'Spectra Medical', logo: '/company-logos/spectra-medical.png' },
	{ name: 'Vecura', logo: '/company-logos/vecura.png' },
	{ name: 'Scans World', logo: '/company-logos/scans-world.png' }
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
		<section className='w-full bg-background-600 pt-12'>
			<div className='max-w-7xl mx-auto px-4 flex flex-col gap-8'>
				<p className='text-base font-medium text-foreground-600'>Find jobs from leading healthcare organizations</p>

				<div className='relative overflow-hidden'>
					<div className='absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background-600 to-transparent z-10 pointer-events-none' />
					<div className='absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background-600 to-transparent z-10 pointer-events-none' />
					<div className='embla' ref={emblaRef}>
						<div className='embla__container flex'>
							{[...companies, ...companies].map((company, index) => (
								<div key={`${company.name}-${index}`} className='embla__slide flex-[0_0_200px] flex items-center justify-center h-16 mx-4'>
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
			</div>
		</section>
	);
}
