"use client";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-full w-full">
			<div className="w-full mx-auto grow h-full">
				<div className="w-full h-full relative">
					<div className="w-full max-w-7xl h-full">{children}</div>
				</div>
			</div>
		</div>
	);
}
