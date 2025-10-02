import Image from 'next/image';
import { APP_TITLE } from '@/lib/constants';

export default function Introduction() {
	return (
		<div className='py-4 bg-background-500 w-full'>
			<div className='max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 justify-between'>
				<div className='flex-1'>
					<h2 className='text-lg font-medium text-foreground-600 mb-6'>About {APP_TITLE}</h2>
					<p className='text-sm sm:text-base text-foreground-500 leading-relaxed'>
						{APP_TITLE} empowers HR professionals and recruiters to post healthcare vacancies and discover qualified candidates. Our
						platform streamlines the hiring process for hospitals and healthcare organizations across India.
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
