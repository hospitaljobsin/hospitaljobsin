import { Input, type InputProps } from '@heroui/react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useCallback, useState } from 'react';

interface SteppableNumberInputProps extends Omit<InputProps, 'value' | 'onValueChange' | 'type' | 'endContent'> {
	value?: number | null;
	onValueChange?: (value: number | null) => void;
	step?: number;
	min?: number;
	max?: number;
	formatOptions?: Intl.NumberFormatOptions;
	isClearable?: boolean;
	onClear?: () => void;
}

export function SteppableNumberInput({
	value,
	onValueChange,
	step = 1,
	min,
	max,
	formatOptions,
	isClearable,
	onClear,
	...inputProps
}: SteppableNumberInputProps) {
	const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions) => {
		if (options) {
			return new Intl.NumberFormat('en-IN', options).format(num);
		}
		return num.toString();
	}, []);

	const [inputValue, setInputValue] = useState(() => (value != null ? formatNumber(value, formatOptions) : ''));

	const parseNumber = useCallback((str: string) => {
		const cleaned = str.replace(/[^\d.-]/g, '');
		const parsed = Number.parseFloat(cleaned);
		return Number.isNaN(parsed) ? null : parsed;
	}, []);

	const handleInputChange = useCallback(
		(val: string) => {
			setInputValue(val);
			const parsed = parseNumber(val);
			onValueChange?.(parsed);
		},
		[parseNumber, onValueChange]
	);

	const handleStep = useCallback(
		(direction: 'up' | 'down') => {
			const currentValue = value ?? 0;
			const newValue = direction === 'up' ? currentValue + step : currentValue - step;

			if (min !== undefined && newValue < min) return;
			if (max !== undefined && newValue > max) return;

			const formatted = formatNumber(newValue, formatOptions);
			setInputValue(formatted);
			onValueChange?.(newValue);
		},
		[value, step, min, max, formatNumber, formatOptions, onValueChange]
	);

	return (
		<Input
			{...inputProps}
			type='text'
			value={inputValue}
			onValueChange={handleInputChange}
			endContent={
				<div className='flex items-center gap-1'>
					{isClearable && inputValue && (
						<button
							type='button'
							className='p-1 hover:bg-default-100 rounded-sm'
							onClick={() => {
								setInputValue('');
								onClear?.();
							}}
							tabIndex={-1}
						>
							<X size={12} />
						</button>
					)}
					<div className='flex flex-col'>
						<button type='button' className='p-1 hover:bg-default-100 rounded-sm' onClick={() => handleStep('up')} tabIndex={-1}>
							<ChevronUp size={12} />
						</button>
						<button type='button' className='p-1 hover:bg-default-100 rounded-sm' onClick={() => handleStep('down')} tabIndex={-1}>
							<ChevronDown size={12} />
						</button>
					</div>
				</div>
			}
		/>
	);
}
