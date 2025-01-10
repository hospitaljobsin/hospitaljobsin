import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="bg-gray-100 w-full">
				<div className="py-24 px-5 w-full h-full flex flex-col gap-8 text-center max-w-5xl mx-auto">
					<h1 className="text-5xl font-medium text-balance">
						Find Your Perfect Fit in Medicine: Explore Top Healthcare Careers
					</h1>
				</div>
			</div>
			<div className="py-8 w-full h-full flex flex-col gap-8 max-w-5xl mx-auto">
				<Suspense fallback={<LandingViewSkeleton />}>
					<LandingView />
				</Suspense>
			</div>
		</>
	);
}
