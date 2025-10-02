import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

export default function Introduction() {
	return (
		<div className='py-4 bg-background-500'>
			<div className='max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 justify-between'>
				<div className='flex-1'>
					<h2 className='text-lg font-medium text-foreground-600 mb-6'>About {APP_NAME}</h2>
					<p className='text-sm sm:text-base text-foreground-500 leading-relaxed'>
						{APP_NAME} connects healthcare professionals with top hospitals across India. Our growing platform helps doctors, nurses, and
						medical staff find opportunities that advance their careers.
					</p>
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
