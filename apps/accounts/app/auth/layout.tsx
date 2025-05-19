"use client";

import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	// we need to wrap this layout in a suspense as the children use
	// the useSearchParams API from next/navigation which suspends
	return (
		<Suspense>
			<div className="w-full flex h-screen items-center justify-center bg-background sm:bg-background-600">
				<div className="mx-auto w-full flex-1 sm:px-6">
					<div className="w-full max-w-md mx-auto">{children}</div>
				</div>
				<div className="h-full bg-primary-400 flex-1 hidden lg:block relative" />
			</div>
		</Suspense>
	);
}
