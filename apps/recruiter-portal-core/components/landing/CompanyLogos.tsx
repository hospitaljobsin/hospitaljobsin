'use client';
import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const companies = [
	{ name: 'GEM Hospital', logo: '/company-logos/gem-hospital.png' },
	{ name: 'Kauvery Hospital', logo: '/company-logos/kauvery-hospital.png' },
	{ name: 'Spectra Medical', logo: '/company-logos/spectra-medical.png' },
	{ name: 'Vecura', logo: '/company-logos/vecura.png' },
	{ name: 'Scans World', logo: '/company-logos/scans-world.png' }
];

export default function CompanyLogos() {
	const [isHovered, setIsHovered] = useState(false);
	const controls = useAnimationControls();

	useEffect(() => {
		if (!isHovered) {
			const animate = async () => {
				await controls.set({ x: 0 });
				await controls.start({
					x: `-${100 / companies.length}%`,
					transition: { duration: 15, ease: 'linear' }
				});
				animate();
			};
			animate();
		} else {
			controls.stop();
		}
	}, [isHovered, controls]);

	return (
		<section className='w-full bg-background pt-12'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='text-center mb-8'>
					<p className='text-sm font-medium text-foreground-600'>Trusted by leading healthcare organizations</p>
				</div>

				<div className='relative overflow-hidden' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
					<div className='absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none' />
					<div className='absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none' />
					<motion.div className='flex gap-8 items-center' animate={controls} style={{ width: '200%' }}>
						{[...companies, ...companies].map((company, index) => (
							<div key={`${company.name}-${index}`} className='flex items-center justify-center min-w-[200px] h-16'>
								<Image src={company.logo} alt={company.name} width={100} height={50} className='object-contain' title={company.name} />
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
