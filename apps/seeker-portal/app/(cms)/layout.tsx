export default function RootLayout({ children }) {
	return (
		<html suppressHydrationWarning>
			<body id='outstatic'>{children}</body>
		</html>
	);
}
