import { Select, SelectItem } from "@heroui/react";
import React from "react";

const MONTHS = [
	{ value: 1, label: "January" },
	{ value: 2, label: "February" },
	{ value: 3, label: "March" },
	{ value: 4, label: "April" },
	{ value: 5, label: "May" },
	{ value: 6, label: "June" },
	{ value: 7, label: "July" },
	{ value: 8, label: "August" },
	{ value: 9, label: "September" },
	{ value: 10, label: "October" },
	{ value: 11, label: "November" },
	{ value: 12, label: "December" },
];

const getYearRange = (start: number, end: number) => {
	const years = [];
	for (let y = end; y >= start; y--) {
		years.push(y);
	}
	return years;
};

export type MonthYearValue = { month: number; year: number } | null;

interface MonthYearPickerProps {
	label?: string;
	value: MonthYearValue;
	onChange: (val: MonthYearValue) => void;
	errorMessage?: string;
	isInvalid?: boolean;
	isDisabled?: boolean;
	minYear?: number;
	maxYear?: number;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
	label,
	value,
	onChange,
	errorMessage,
	isInvalid,
	isDisabled,
	minYear = 1950,
	maxYear = new Date().getFullYear() + 5,
}) => {
	console.log("value: ", value);
	console.log(value?.year ? [String(value.year)] : []);
	const years = getYearRange(minYear, maxYear);
	const monthId = React.useId();

	const handleMonthChange = (month: number | null) => {
		if (month) {
			const year = value?.year ?? new Date().getFullYear();
			onChange({ month, year });
		} else if (value?.year) {
			onChange({ month: 1, year: value.year });
		} else {
			onChange(null);
		}
	};

	const handleYearChange = (year: number | null) => {
		if (year) {
			const month = value?.month ?? 1;
			onChange({ month, year });
		} else if (value?.month) {
			onChange({ month: value.month, year: new Date().getFullYear() });
		} else {
			onChange(null);
		}
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<label htmlFor={monthId} className="text-sm font-medium mb-1">
					{label}
				</label>
			)}
			<div className="flex gap-2 w-full">
				<Select
					id={monthId}
					label="Month"
					placeholder="Month"
					selectedKeys={value?.month ? [String(value.month)] : []}
					onSelectionChange={(keys) => {
						const m = Number(Array.from(keys)[0]);
						handleMonthChange(Number.isNaN(m) ? null : m);
					}}
					isInvalid={isInvalid}
					isDisabled={isDisabled}
					className="flex-1"
				>
					{MONTHS.map((m) => (
						<SelectItem key={String(m.value)}>{m.label}</SelectItem>
					))}
				</Select>
				<Select
					label="Year"
					placeholder="Year"
					selectedKeys={value?.year ? [String(value.year)] : []}
					onSelectionChange={(keys) => {
						const yStr = Array.from(keys)[0];
						const y = Number(yStr);
						handleYearChange(Number.isNaN(y) ? null : y);
					}}
					isInvalid={isInvalid}
					isDisabled={isDisabled}
					className="flex-1"
				>
					{years.map((y) => {
						return <SelectItem key={String(y)}>{y.toString()}</SelectItem>;
					})}
				</Select>
			</div>
			{errorMessage && (
				<span className="text-xs text-danger-500 mt-1">{errorMessage}</span>
			)}
		</div>
	);
};
