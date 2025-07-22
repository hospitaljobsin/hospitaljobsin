import type { ChipProps, InputProps } from "@heroui/react";
import { Chip, Input } from "@heroui/react";
import { useState } from "react";
import type { Control, FieldArrayPath, FieldValues } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

interface ChipsInputProps<
	TFieldValues extends FieldValues,
	TName extends FieldArrayPath<TFieldValues>,
> {
	label: string;
	name: TName;
	control: Control<TFieldValues>;
	placeholder?: string;
	delimiters: string[];
	chipProps?: ChipProps;
	inputProps?: InputProps;
	allowDuplicates?: boolean;
}

export function ChipsInput<
	TFieldValues extends FieldValues,
	TName extends FieldArrayPath<TFieldValues>,
>({
	name,
	control,
	label,
	delimiters,
	chipProps = {},
	inputProps = {},
	allowDuplicates = false,
}: ChipsInputProps<TFieldValues, TName>) {
	const { fields, append, remove } = useFieldArray<
		TFieldValues,
		TName,
		typeof label
	>({
		control,
		name,
	});
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (delimiters.includes(e.key)) {
			e.preventDefault();
			const trimmedValue = inputValue.trim();
			if (trimmedValue) {
				if (
					!allowDuplicates &&
					fields.some((field) => field.value === trimmedValue)
				) {
					setInputValue("");
					return;
				}
				append({
					value: trimmedValue,
				} as unknown as TFieldValues[TName][number]);
				setInputValue("");
			}
		}
	};

	const handleBlur = () => {
		const trimmedValue = inputValue.trim();
		if (trimmedValue) {
			if (
				!allowDuplicates &&
				fields.some((field) => field.value === trimmedValue)
			) {
				setInputValue("");
				return;
			}
			append({ value: trimmedValue } as unknown as TFieldValues[TName][number]);
			setInputValue("");
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData("text");
		// Create a regex to split by any of the delimiters
		const splitRegex = /\s*,\s*(?:and\s*)?/i;
		const values = pastedText
			.split(splitRegex)
			.map((v) => v.trim())
			.filter(Boolean);
		let added = false;
		for (const val of values) {
			if (!val) continue;
			if (!allowDuplicates && fields.some((field) => field.value === val)) {
				continue;
			}
			append({ value: val } as unknown as TFieldValues[TName][number]);
			added = true;
		}
		if (added) setInputValue("");
	};

	return (
		<div className="w-full flex flex-col gap-6">
			<Input
				type="text"
				label={label}
				labelPlacement="outside"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onPaste={handlePaste}
				{...inputProps}
			/>
			<div className="flex flex-wrap gap-2 mb-2">
				{fields.map((field, index) => (
					<Chip key={field.id} {...chipProps} onClose={() => remove(index)}>
						{field.value}
					</Chip>
				))}
			</div>
		</div>
	);
}
