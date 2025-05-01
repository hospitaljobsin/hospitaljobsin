import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import { Suspense } from "react";

export default function LandingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full h-full flex flex-col">
			<Suspense fallback={<HeaderSkeleton variant="hero" />}>
				<Header variant="hero" />
			</Suspense>
			<div className="w-full mx-auto bg-background-600 h-full">{children}</div>
		</div>
	);
}
