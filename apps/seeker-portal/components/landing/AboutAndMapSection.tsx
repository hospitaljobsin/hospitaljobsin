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
			{/* Full-width background map */}
			<div className='absolute inset-0 opacity-15'>
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative background map pattern */}
				<svg viewBox='0 0 1440 320' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
					{/* City blocks and streets */}
					<defs>
						<pattern id={patternId} patternUnits='userSpaceOnUse' width='120' height='80'>
							<rect width='120' height='80' fill='none' />
							{/* City blocks */}
							<rect x='10' y='10' width='30' height='25' fill='currentColor' className='text-background-300' opacity='0.3' />
							<rect x='45' y='10' width='25' height='30' fill='currentColor' className='text-background-300' opacity='0.2' />
							<rect x='75' y='15' width='35' height='20' fill='currentColor' className='text-background-300' opacity='0.4' />
							<rect x='10' y='40' width='40' height='25' fill='currentColor' className='text-background-300' opacity='0.25' />
							<rect x='55' y='45' width='30' height='20' fill='currentColor' className='text-background-300' opacity='0.35' />
							<rect x='90' y='40' width='20' height='30' fill='currentColor' className='text-background-300' opacity='0.3' />
							{/* Streets */}
							<line x1='0' y1='35' x2='120' y2='35' stroke='currentColor' strokeWidth='2' className='text-foreground-300' />
							<line x1='40' y1='0' x2='40' y2='80' stroke='currentColor' strokeWidth='2' className='text-foreground-300' />
							<line x1='72' y1='0' x2='72' y2='80' stroke='currentColor' strokeWidth='1.5' className='text-foreground-300' />
							<line x1='0' y1='65' x2='120' y2='65' stroke='currentColor' strokeWidth='1.5' className='text-foreground-300' />
						</pattern>
					</defs>

					{/* Apply city block pattern */}
					<rect width='1440' height='320' fill={`url(#${patternId})`} />

					{/* Major roads and highways */}
					<path
						d='M0 160 Q360 140 720 160 Q900 170 1080 155 Q1200 145 1440 160'
						stroke='currentColor'
						strokeWidth='4'
						fill='none'
						className='text-foreground-400'
					/>
					<path
						d='M360 0 Q380 80 360 160 Q340 240 360 320'
						stroke='currentColor'
						strokeWidth='4'
						fill='none'
						className='text-foreground-400'
					/>
					<path
						d='M720 0 Q700 80 720 160 Q740 240 720 320'
						stroke='currentColor'
						strokeWidth='3'
						fill='none'
						className='text-foreground-400'
					/>
					<path
						d='M1080 0 Q1060 80 1080 160 Q1100 240 1080 320'
						stroke='currentColor'
						strokeWidth='3'
						fill='none'
						className='text-foreground-400'
					/>

					{/* Secondary roads */}
					<path
						d='M0 80 Q180 70 360 80 Q540 90 720 80 Q900 70 1080 85 Q1260 75 1440 80'
						stroke='currentColor'
						strokeWidth='2'
						fill='none'
						className='text-foreground-350'
					/>
					<path
						d='M0 240 Q180 250 360 240 Q540 230 720 240 Q900 250 1080 235 Q1260 245 1440 240'
						stroke='currentColor'
						strokeWidth='2'
						fill='none'
						className='text-foreground-350'
					/>

					{/* Curved roads */}
					<path
						d='M180 0 Q200 40 180 80 Q160 120 180 160 Q200 200 180 240 Q160 280 180 320'
						stroke='currentColor'
						strokeWidth='2'
						fill='none'
						className='text-foreground-350'
					/>
					<path
						d='M540 40 Q560 80 540 120 Q520 160 540 200 Q560 240 540 280'
						stroke='currentColor'
						strokeWidth='2'
						fill='none'
						className='text-foreground-350'
					/>
					<path
						d='M900 60 Q920 100 900 140 Q880 180 900 220 Q920 260 900 300'
						stroke='currentColor'
						strokeWidth='2'
						fill='none'
						className='text-foreground-350'
					/>

					{/* Roundabouts */}
					<circle cx='360' cy='160' r='12' fill='none' stroke='currentColor' strokeWidth='2' className='text-foreground-400' />
					<circle cx='720' cy='160' r='10' fill='none' stroke='currentColor' strokeWidth='2' className='text-foreground-400' />
					<circle cx='1080' cy='160' r='8' fill='none' stroke='currentColor' strokeWidth='1.5' className='text-foreground-400' />

					{/* Hospital/Job location markers */}
					<g>
						{/* Hospital icons (larger markers) */}
						<circle cx='280' cy='150' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M276 150 L284 150 M280 146 L280 154' stroke='white' strokeWidth='2' strokeLinecap='round' />

						<circle cx='520' cy='170' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M516 170 L524 170 M520 166 L520 174' stroke='white' strokeWidth='2' strokeLinecap='round' />

						<circle cx='760' cy='145' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M756 145 L764 145 M760 141 L760 149' stroke='white' strokeWidth='2' strokeLinecap='round' />

						<circle cx='1000' cy='175' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M996 175 L1004 175 M1000 171 L1000 179' stroke='white' strokeWidth='2' strokeLinecap='round' />

						<circle cx='1200' cy='155' r='8' fill='currentColor' className='text-primary-600' />
						<path d='M1196 155 L1204 155 M1200 151 L1200 159' stroke='white' strokeWidth='2' strokeLinecap='round' />

						{/* Clinic locations (smaller markers) */}
						<circle cx='180' cy='90' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='420' cy='200' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='660' cy='120' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='840' cy='190' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='1120' cy='130' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='300' cy='250' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='600' cy='80' r='5' fill='currentColor' className='text-accent-400' />
						<circle cx='950' cy='260' r='5' fill='currentColor' className='text-accent-400' />
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
