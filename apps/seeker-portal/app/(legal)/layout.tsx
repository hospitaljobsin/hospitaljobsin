export default function LegalLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="w-full h-full bg-background-200">
			<div className="w-full px-5 max-w-7xl mx-auto prose prose-sm py-12">
				{children}
			</div>
		</div>
	);
}
