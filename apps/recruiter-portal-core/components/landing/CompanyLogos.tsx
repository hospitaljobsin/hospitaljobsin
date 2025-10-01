'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const companies = [
	{ name: 'GEM Hospital', logo: '/company-logos/gem-hospital.png' },
	{ name: 'Kauvery Hospital', logo: '/company-logos/kauvery-hospital.png' },
	{ name: 'Spectra Medical', logo: '/company-logos/spectra-medical.png' },
	{ name: 'Vecura', logo: '/company-logos/vecura.png' }
];

export default function CompanyLogos() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<section className='w-full bg-background pt-12'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='text-center mb-8'>
					<p className='text-sm font-medium text-foreground-600 tracking-wide'>Trusted by leading healthcare organizations</p>
				</div>

				<div className='relative overflow-hidden' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
					<motion.div
						className='flex gap-8 items-center'
						animate={
							isHovered
								? {}
								: {
										x: [0, -100 * companies.length]
									}
						}
						transition={{
							x: {
								repeat: Number.POSITIVE_INFINITY,
								repeatType: 'loop',
								duration: 20,
								ease: 'linear'
							}
						}}
						style={{ width: `${200 * companies.length}%` }}
					>
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
