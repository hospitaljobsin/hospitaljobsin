import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';
import { APP_NAME } from '@/lib/constants';
import links from '@/lib/links';

export default function AboutAndMapSection() {
	const patternId = useId();
	return (
		<div className='relative py-8 sm:py-12 bg-background-500 overflow-hidden'>
			{/* Full-width background map - South India outline */}
			<div className='absolute inset-0 opacity-15'>
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative background map of South India */}
				<svg viewBox='0 0 1440 320' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
					{/* South India coastline and state boundaries */}
					<g>
						{/* Karnataka outline */}
						<path
							d='M200 80 L350 85 L380 120 L370 160 L340 190 L300 180 L250 200 L200 180 L180 140 L200 100 Z'
							fill='currentColor'
							stroke='currentColor'
							strokeWidth='1'
							className='text-background-300'
							opacity='0.2'
						/>

						{/* Tamil Nadu outline */}
						<path
							d='M350 120 L480 130 L520 170 L530 220 L510 280 L480 300 L430 290 L400 260 L380 220 L350 180 Z'
							fill='currentColor'
							stroke='currentColor'
							strokeWidth='1'
							className='text-background-300'
							opacity='0.25'
						/>

						{/* Kerala outline */}
						<path
							d='M300 180 L340 190 L380 220 L390 260 L380 300 L350 310 L320 300 L300 280 L290 240 L300 200 Z'
							fill='currentColor'
							stroke='currentColor'
							strokeWidth='1'
							className='text-background-300'
							opacity='0.2'
						/>

						{/* Andhra Pradesh/Telangana outline */}
						<path
							d='M380 50 L550 60 L580 90 L570 130 L540 150 L480 140 L420 120 L380 100 Z'
							fill='currentColor'
							stroke='currentColor'
							strokeWidth='1'
							className='text-background-300'
							opacity='0.18'
						/>

						{/* Goa outline (small) */}
						<path
							d='M180 140 L220 145 L230 160 L220 175 L200 180 L180 170 Z'
							fill='currentColor'
							stroke='currentColor'
							strokeWidth='1'
							className='text-background-300'
							opacity='0.3'
						/>

						{/* Coastline - Arabian Sea */}
						<path
							d='M180 140 C160 150 150 180 160 220 C170 260 180 290 200 310 L320 300 L380 300 C390 290 400 280 410 270'
							stroke='currentColor'
							strokeWidth='2'
							fill='none'
							className='text-foreground-400'
							opacity='0.4'
						/>

						{/* Coastline - Bay of Bengal */}
						<path
							d='M530 220 C540 240 550 260 560 280 C570 300 580 310 590 315 L480 300 L530 280 L540 260 L530 240'
							stroke='currentColor'
							strokeWidth='2'
							fill='none'
							className='text-foreground-400'
							opacity='0.4'
						/>

						{/* Major rivers */}
						<path
							d='M380 50 Q420 80 460 110 Q500 140 530 170'
							stroke='currentColor'
							strokeWidth='1.5'
							fill='none'
							className='text-foreground-350'
							opacity='0.6'
						/>
						<path
							d='M200 100 Q250 130 300 160 Q350 190 400 220'
							stroke='currentColor'
							strokeWidth='1.5'
							fill='none'
							className='text-foreground-350'
							opacity='0.6'
						/>

						{/* Repeat pattern across the width */}
						<g transform='translate(600, 0)'>
							{/* Karnataka outline */}
							<path
								d='M200 80 L350 85 L380 120 L370 160 L340 190 L300 180 L250 200 L200 180 L180 140 L200 100 Z'
								fill='currentColor'
								stroke='currentColor'
								strokeWidth='1'
								className='text-background-300'
								opacity='0.15'
							/>
							{/* Tamil Nadu outline */}
							<path
								d='M350 120 L480 130 L520 170 L530 220 L510 280 L480 300 L430 290 L400 260 L380 220 L350 180 Z'
								fill='currentColor'
								stroke='currentColor'
								strokeWidth='1'
								className='text-background-300'
								opacity='0.18'
							/>
						</g>
					</g>

					{/* Hospital/Healthcare facility markers positioned on major cities */}
					<g>
						{/* Major hospitals in Bangalore */}
						<circle cx='280' cy='150' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M276 150 L284 150 M280 146 L280 154' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Major hospitals in Chennai */}
						<circle cx='480' cy='200' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M476 200 L484 200 M480 196 L480 204' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Major hospitals in Hyderabad */}
						<circle cx='520' cy='100' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M516 100 L524 100 M520 96 L520 104' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Major hospitals in Kochi */}
						<circle cx='340' cy='250' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M336 250 L344 250 M340 246 L340 254' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Major hospitals in Coimbatore */}
						<circle cx='420' cy='180' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M416 180 L424 180 M420 176 L420 184' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Repeated pattern for right side */}
						{/* Major hospitals in Bangalore (repeated) */}
						<circle cx='880' cy='150' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M876 150 L884 150 M880 146 L880 154' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Major hospitals in Chennai (repeated) */}
						<circle cx='1080' cy='200' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M1076 200 L1084 200 M1080 196 L1080 204' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Smaller healthcare facilities */}
						<circle cx='220' cy='120' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='380' cy='130' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='450' cy='160' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='360' cy='220' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='500' cy='240' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='320' cy='280' r='5' fill='currentColor' className='text-accent-400' />

						{/* Repeated smaller facilities */}
						<circle cx='820' cy='120' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='980' cy='130' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='1050' cy='160' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='960' cy='220' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='1100' cy='240' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='920' cy='280' r='5' fill='currentColor' className='text-accent-400' />
					</g>
				</svg>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 justify-between'>
				<div className='flex-1'>
					<h2 className='text-lg font-medium text-foreground-600 mb-6'>About {APP_NAME}</h2>
					<p className='text-sm sm:text-base text-foreground-500 leading-relaxed mb-6'>
						{APP_NAME} connects healthcare professionals with top hospitals across India. Our growing platform helps doctors, nurses, and
						medical staff find opportunities that advance their careers.
					</p>
					<p className='text-sm sm:text-base text-foreground-500 leading-relaxed mb-6'>
						Explore healthcare opportunities in your area with our interactive map. Find jobs based on location, specialty, and proximity to
						your home.
					</p>
					<Link
						href={links.searchMap()}
						className='inline-flex items-center gap-2 bg-primary-600 text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors'
					>
						Explore Nearby Jobs <ArrowRight className='w-4 h-4' strokeWidth={3} />
					</Link>
				</div>
				<div className='min-w-64 flex justify-center'>
					<div className='relative w-full h-52'>
						<Image src='/doctors.svg' alt='Healthcare professionals illustration' fill className='object-contain' />
					</div>
				</div>
			</div>
		</div>
	);
}
