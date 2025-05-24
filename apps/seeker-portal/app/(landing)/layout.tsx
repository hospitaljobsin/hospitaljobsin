import HeaderClientComponent from "../../components/layout/HeaderClientComponent";

export default function LandingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<HeaderClientComponent variant="hero" />
			<div className="w-full mx-auto bg-background-600 h-full">{children}</div>
		</div>
	);
}
