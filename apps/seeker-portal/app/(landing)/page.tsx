import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="bg-background-800 relative">
				<div className="pt-20 sm:pt-28 pb-20 sm:pb-40 px-4 sm:px-5 w-full h-full flex flex-col gap-4 sm:gap-8 text-center max-w-xl sm:max-w-3xl mx-auto">
					{/* <h1 className="text-4xl sm:text-6xl font-bold text-balance">
						Find Your Next Medical Position
					</h1>
					<h2 className="mx-auto text-lg sm:text-xl text-balance text-foreground-600 leading-relaxed">
						Connecting you to top job opportunities in healthcare.
					</h2> */}
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
