import type { ChipProps, InputProps } from '@heroui/react';
import { Chip, Input } from '@heroui/react';
import { useState } from 'react';
import type { Control, FieldArrayPath, FieldValues } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

interface ChipsInputProps<TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>> {
	label: string;
	name: TName;
	control: Control<TFieldValues>;
	placeholder?: string;
	delimiters: string[];
	chipProps?: ChipProps;
	inputProps?: InputProps;
	allowDuplicates?: boolean;
	minLength?: number;
	maxLength?: number;
}

export function ChipsInput<TFieldValues extends FieldValues, TName extends FieldArrayPath<TFieldValues>>({
	name,
	control,
	label,
	delimiters,
	chipProps = {},
	inputProps = {},
	allowDuplicates = false,
	minLength = 1,
	maxLength
}: ChipsInputProps<TFieldValues, TName>) {
	const { fields, append, remove } = useFieldArray<TFieldValues, TName, typeof label>({
		control,
		name
	});
	const [inputValue, setInputValue] = useState('');

	const addValue = (value: string) => {
		const trimmedValue = value.trim();
		if (trimmedValue && trimmedValue.length >= minLength && (!maxLength || trimmedValue.length <= maxLength)) {
			if (!allowDuplicates && fields.some(field => field.value === trimmedValue)) {
				return false;
			}
			append({ value: trimmedValue } as unknown as TFieldValues[TName][number]);
			return true;
		}
		return false;
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (delimiters.includes(e.key)) {
			e.preventDefault();
			if (addValue(inputValue)) {
				setInputValue('');
			}
		}
	};

	const handleBlur = () => {
		if (addValue(inputValue)) {
			setInputValue('');
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
		let added = false;
		for (const val of values) {
			if (addValue(val)) added = true;
		}
		if (added) setInputValue('');
	};

	return (
		<div className='w-full flex flex-col gap-6'>
			<Input
				type='text'
				label={label}
				labelPlacement='outside'
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onPaste={handlePaste}
				minLength={minLength}
				maxLength={maxLength}
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
