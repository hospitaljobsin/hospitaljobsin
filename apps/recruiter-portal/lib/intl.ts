export const dateFormat = new Intl.DateTimeFormat("en-US", {
	dateStyle: "long",
});

export const timeFormat = new Intl.NumberFormat("en-US", {
	minimumIntegerDigits: 2,
	useGrouping: false,
});

export const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export function getRelativeTimeString(date: string | Date): string {
	// Convert string timestamps to Date objects
	if (typeof date === "string") {
		date = new Date(date); // JavaScript correctly treats this as UTC
	}

	// Get the amount of seconds between the given date and now
	const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);

	// Time intervals in seconds
	const cutoffs = [
		60,
		3600,
		86400,
		86400 * 7,
		86400 * 30,
		86400 * 365,
		Infinity,
	];
	const units: Intl.RelativeTimeFormatUnit[] = [
		"second",
		"minute",
		"hour",
		"day",
		"week",
		"month",
		"year",
	];

	const unitIndex = cutoffs.findIndex(
		(cutoff) => cutoff > Math.abs(deltaSeconds),
	);
	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
