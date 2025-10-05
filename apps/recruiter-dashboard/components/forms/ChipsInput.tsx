import type { ChipProps, InputProps } from '@heroui/react';
import { Chip, Input } from '@heroui/react';
import type { Control, FieldArrayPath, FieldValues } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';

interface ChipsInputProps<TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>> {
	label: string;
	name: TName;
	control: Control<TFieldValues>;
	placeholder?: string;
	delimiters: string[];
	chipProps?: ChipProps;
	inputProps?: InputProps;
	allowDuplicates?: boolean;
	validate?: (value: string) => string | true;
}

export function ChipsInput<TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>>({
	name,
	control,
	label,
	delimiters,
	chipProps = {},
	inputProps = {},
	allowDuplicates = false,
	validate
}: ChipsInputProps<TFieldValues, TName>) {
	const { fields, append, remove } = useFieldArray<TFieldValues, TName, typeof label>({
		control,
		name
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<{ chipInput: string }>({
		mode: 'onChange'
	});

	const addValue = (value: string) => {
		const trimmedValue = value.trim();
		if (!trimmedValue) return false;
		if (!allowDuplicates && fields.some(field => field.value === trimmedValue)) return false;
		append({ value: trimmedValue } as unknown as TFieldValues[TName][number]);
		return true;
	};

	const onSubmitChip = handleSubmit(data => {
		if (addValue(data.chipInput)) reset();
	});

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (delimiters.includes(e.key)) {
			e.preventDefault();
			onSubmitChip();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData('text');
		const splitRegex = /\s*,\s*(?:and\s*)?/i;
		const values = pastedText
			.split(splitRegex)
			.map(v => v.trim())
			.filter(Boolean);
		for (const val of values) {
			const validationResult = validate?.(val) ?? true;
			if (validationResult === true) addValue(val);
		}
		reset();
	};

	return (
		<div className='w-full flex flex-col gap-6'>
			<Input
				{...register('chipInput', { validate })}
				type='text'
				label={label}
				labelPlacement='outside'
				onKeyDown={handleKeyDown}
				onBlur={onSubmitChip}
				onPaste={handlePaste}
				errorMessage={errors.chipInput?.message}
				isInvalid={!!errors.chipInput}
				{...inputProps}
			/>
			{fields.length > 0 && (
				<div className='flex flex-wrap gap-2'>
					{fields.map((field, index) => (
						<Chip key={field.id} {...chipProps} onClose={() => remove(index)}>
							{field.value}
						</Chip>
					))}
				</div>
			)}
		</div>
	);
}
