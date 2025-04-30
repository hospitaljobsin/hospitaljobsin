import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="bg-primary-400 relative" >
				<div className="pt-20 sm:pt-28 pb-20 sm:pb-48 px-4 sm:px-5 w-full h-full flex flex-col gap-4 sm:gap-8 text-center max-w-xl sm:max-w-7xl mx-auto">
					<h1 className="text-4xl sm:text-6xl font-medium tracking-tighter text-balance text-primary-foreground">
					Connecting Healthcare Heroes with Their Next Opportunity
					</h1>
				</div>
			</div>

			<div className="py-4 sm:py-8 flex flex-col gap-4 sm:gap-8 max-w-5xl px-4 sm:px-5 mx-auto">
				<Suspense fallback={<LandingViewSkeleton />}>
					<LandingView />
				</Suspense>
			</div>
		</>
	);
}
