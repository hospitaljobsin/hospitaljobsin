'use client';

import { Button, Input } from '@heroui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import CompleteProfileContext from '../CompleteProfileContext';

const educationSchema = z.object({
	education: z
		.array(
			z.object({
				degree: z.string().min(1, 'Degree is required'),
				institution: z.string().min(1, 'Institution is required'),
				year: z.string().length(4, 'Year must be 4 digits')
			})
		)
		.min(1, 'At least one education entry is required')
});

export default function EducationStep() {
	const { send } = CompleteProfileContext.useActorRef();
	const education = CompleteProfileContext.useSelector(state => state.context.education);

	const { register, control, handleSubmit, formState } = useForm<z.infer<typeof educationSchema>>({
		resolver: standardSchemaResolver(educationSchema),
		defaultValues: {
			education: education.length > 0 ? education : [{ degree: '', institution: '', year: '' }]
		}
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'education'
	});

	const onSubmit = async (data: z.infer<typeof educationSchema>) => {
		// Mock mutation call
		console.log('Saving education:', data.education);

		send({
			type: 'SUBMIT_EDUCATION',
			education: data.education
		});
	};

	const handlePrevious = () => {
		send({ type: 'PREVIOUS_STEP' });
	};

	const addEducation = () => {
		append({ degree: '', institution: '', year: '' });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-semibold'>Education</h3>
				<p className='text-sm text-foreground-600'>Add your educational qualifications. At least one entry is required.</p>
			</div>

			<div className='space-y-4'>
				{fields.map((field, index) => (
					<div key={field.id} className='p-4 border border-divider rounded-lg space-y-3'>
						<div className='flex justify-between items-center'>
							<h4 className='font-medium'>Education {index + 1}</h4>
							{fields.length > 1 && (
								<Button type='button' size='sm' variant='light' color='danger' isIconOnly onPress={() => remove(index)}>
									<Trash2 size={16} />
								</Button>
							)}
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
							<Input
								{...register(`education.${index}.degree`)}
								label='Degree'
								placeholder='e.g., MBBS, MD, BSc Nursing'
								errorMessage={formState.errors.education?.[index]?.degree?.message}
								isInvalid={!!formState.errors.education?.[index]?.degree}
							/>
							<Input
								{...register(`education.${index}.year`)}
								label='Year'
								placeholder='e.g., 2020'
								type='number'
								errorMessage={formState.errors.education?.[index]?.year?.message}
								isInvalid={!!formState.errors.education?.[index]?.year}
							/>
						</div>

						<Input
							{...register(`education.${index}.institution`)}
							label='Institution'
							placeholder='e.g., All Institute of Medical Sciences'
							errorMessage={formState.errors.education?.[index]?.institution?.message}
							isInvalid={!!formState.errors.education?.[index]?.institution}
						/>
					</div>
				))}
			</div>

			<Button type='button' variant='bordered' startContent={<Plus size={16} />} onPress={addEducation} fullWidth>
				Add Another Education
			</Button>

			{formState.errors.education?.root && <p className='text-danger text-sm'>{formState.errors.education.root.message}</p>}

			<div className='flex gap-3'>
				<Button type='button' variant='flat' fullWidth onPress={handlePrevious}>
					Previous
				</Button>
				<Button type='submit' color='primary' fullWidth isLoading={formState.isSubmitting}>
					Continue
				</Button>
			</div>
		</form>
	);
}
