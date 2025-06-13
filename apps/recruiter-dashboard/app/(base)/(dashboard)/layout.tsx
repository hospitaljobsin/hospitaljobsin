"use client";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-full w-full">
			<div className="w-full mx-auto grow h-full overflow-hidden">
				<div className="w-full h-full relative">
					<div className="w-full max-w-5xl mx-auto h-full overflow-y-auto">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
