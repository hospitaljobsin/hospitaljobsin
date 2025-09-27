import React from 'react';

interface FormFieldProps {
	id: string;
	label: string;
	placeholder: string;
	isTextarea?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ id, label, placeholder, isTextarea = false }) => {
	const inputClasses =
		'form-input w-full rounded-lg border-primary/20 bg-transparent p-3 placeholder:text-background-dark/40 focus:border-primary focus:ring-primary dark:border-primary/30 dark:placeholder:text-background-light/40';

	return (
		<div className='grid grid-cols-1 gap-2'>
			<label className='font-medium' htmlFor={id}>
				{label}
			</label>
			{isTextarea ? (
				<textarea className={`${inputClasses} min-h-36`} id={id} placeholder={placeholder} />
			) : (
				<input className={inputClasses} id={id} placeholder={placeholder} />
			)}
		</div>
	);
};
