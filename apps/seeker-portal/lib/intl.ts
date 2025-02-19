export const dateFormat = new Intl.DateTimeFormat("en-US", {
	dateStyle: "long",
});

export const timeFormat = new Intl.NumberFormat("en-US", {
	minimumIntegerDigits: 2,
	useGrouping: false,
});
