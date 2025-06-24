import { Select, SelectItem } from "@heroui/react";
import React from "react";

export type YearValue = number | null;

interface YearPickerProps {
	label?: string;
	value: YearValue;
	onChange: (val: YearValue) => void;
	errorMessage?: string;
	isInvalid?: boolean;
	isDisabled?: boolean;
	minYear?: number;
	maxYear?: number;
}

const getYearRange = (start: number, end: number) => {
	const years = [];
	for (let y = end; y >= start; y--) {
		years.push(y);
	}
	return years;
};

export const YearPicker: React.FC<YearPickerProps> = ({
	label,
	value,
	onChange,
	errorMessage,
	isInvalid,
	isDisabled,
	minYear = 1950,
	maxYear = new Date().getFullYear() + 5,
}) => {
	const years = getYearRange(minYear, maxYear);
	const yearId = React.useId();

	const handleYearChange = (year: number | null) => {
		onChange(year);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<label htmlFor={yearId} className="text-sm font-medium mb-1">
					{label}
				</label>
			)}
			<Select
				id={yearId}
				label="Year"
				placeholder="Year"
				selectedKeys={value ? [String(value)] : []}
				onSelectionChange={(keys) => {
					const yStr = Array.from(keys)[0];
					const y = Number(yStr);
					handleYearChange(Number.isNaN(y) ? null : y);
				}}
				isInvalid={isInvalid}
				isDisabled={isDisabled}
				className="flex-1"
			>
				{years.map((y) => (
					<SelectItem key={String(y)}>{y.toString()}</SelectItem>
				))}
			</Select>
			{errorMessage && (
				<span className="text-xs text-danger-500 mt-1">{errorMessage}</span>
			)}
		</div>
	);
};
