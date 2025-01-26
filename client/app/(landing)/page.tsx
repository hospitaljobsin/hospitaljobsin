import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="bg-foreground-200 w-full relative">
				<div className="pt-28 pb-40 px-5 w-full h-full flex flex-col gap-8 text-center max-w-5xl mx-auto">
					<h1 className="text-5xl font-medium text-balance">
						Your Trusted Locum Job Board
					</h1>
					<h2 className="mx-auto text-xl text-balance text-foreground-500 mb-24">
						Connecting you to top locum opportunities in healthcare.
					</h2>
				</div>
				{/* Adjusted Curved Divider */}
				<div className="absolute bottom-[-10px] left-0 w-full overflow-hidden leading-[0]">
					<svg
						viewBox="0 0 1440 320"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-auto"
					>
						<title>Curved Divider</title>
						<path
							d="M0,256 C480,160 960,352 1440,256 L1440,320 L0,320 Z"
							className="fill-foreground-100"
						/>
					</svg>
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
