import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="bg-foreground-200 w-full">
				<div className="py-28 px-5 w-full h-full flex flex-col gap-8 text-center max-w-5xl mx-auto">
					<h1 className="text-5xl font-medium text-balance">
						Your Trusted Locum Job Board
					</h1>
					<h2 className="mx-auto text-xl text-balance text-foreground-500">
						Connecting you to top locum opportunities in healthcare.
					</h2>
				</div>
			</div>
			<div className="py-8 w-full h-full flex flex-col gap-8 max-w-5xl px-5 mx-auto bg-foreground-100">
				<Suspense fallback={<LandingViewSkeleton />}>
					<LandingView />
				</Suspense>
			</div>
		</>
	);
}
