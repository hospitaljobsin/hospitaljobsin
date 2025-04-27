import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import { Suspense } from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header />
			</Suspense>
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-5xl mx-auto">{children}</div>
			</div>
		</>
	);
}
