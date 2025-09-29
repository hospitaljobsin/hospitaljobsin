import { Button, Progress } from '@heroui/react';
import { SparkleIcon } from 'lucide-react';

export default function ResumeProgressSkeleton() {
	return (
		<div className='w-full max-w-7xl mx-auto px-4 pb-6 pt-6 md:pt-12 lg:px-8 mb-4'>
			<div className='flex justify-between items-center gap-6 sm:gap-12 lg:grid lg:grid-cols-12 w-full'>
				<Progress
					label='Resume Progress'
					size='md'
					isDisabled
					className='w-full lg:col-span-9'
					classNames={{ label: 'text-foreground-600 text-sm', value: 'text-foreground-600' }}
					showValueLabel
					disableAnimation
				/>
				<Button isDisabled className='min-w-64 hidden sm:flex lg:col-span-3' startContent={<SparkleIcon size={18} />}>
					Autofill With AI
				</Button>
				<Button className='sm:hidden' isIconOnly isDisabled>
					<SparkleIcon size={18} />
				</Button>
			</div>
		</div>
	);
}
