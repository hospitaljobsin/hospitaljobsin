import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="bg-primary-400 relative" >
				{/* SVG background pattern with custom melt pattern and steep fade at the top */}
				<svg
					className="absolute inset-0 w-full h-full pointer-events-none select-none"
					aria-hidden="true"
					focusable="false"
					style={{ zIndex: 0 }}
				>
					<defs>
						<pattern id="pattern-melt" x="0" y="0" width="24" height="20" patternUnits="userSpaceOnUse">
							<g fill="hsl(var(--heroui-primary-500))" fillOpacity="0.2">
								<path d="M20,18 C20,16.8954305 20.8869711,16 21.998291,16 C23.1019167,16 23.9981111,15.1052949 23.9999902,14.0057373 L24,14 L24,20 L20,20 L20,18 Z M0,13.9981014 C0,12.8945804 0.887729645,12 2,12 C3.1045695,12 4,12.8877296 4,14 C4,15.1045695 4.88772964,16 6,16 C7.1045695,16 8,16.8877296 8,18 L8,20 L0,20 L0,13.9981014 Z M16,18.0018986 C16,19.1054196 15.1122704,20 14,20 C12.8954305,20 12,19.1132936 12,18.0018986 L12,13.9981014 C12,12.8945804 11.1122704,12 10,12 C8.8954305,12 8,11.1122704 8,10 C8,8.8954305 7.11227036,8 6,8 C4.8954305,8 4,7.11329365 4,6.00189865 L4,1.99810135 C4,0.894580447 3.11227036,-3.55271368e-15 2,0 C0.8954305,0 2.84217094e-14,0.894705057 3.55271368e-15,2 L0,0 L8,-1.42108547e-14 L8,2 C8,3.1045695 8.88772964,4 10,4 C11.1045695,4 12,4.88772964 12,6 C12,7.1045695 12.8877296,8 14,8 C15.1045695,8 16,7.11227036 16,6 C16,4.8954305 16.8877296,4 18,4 C19.1045695,4 20,3.11227036 20,2 L20,-3.55271368e-15 L24,-3.55271368e-15 L24,6.00189865 C24,7.10541955 23.1122704,8 22,8 C20.8954305,8 20,8.88772964 20,10 C20,11.1045695 19.1122704,12 18,12 C16.8954305,12 16,12.8867064 16,13.9981014 L16,18.0018986 Z" />
							</g>
						</pattern>
						<linearGradient id="fade-gradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="hsl(var(--heroui-primary-400))" stopOpacity="1" />
							<stop offset="8%" stopColor="hsl(var(--heroui-primary-400))" stopOpacity="0" />
							<stop offset="100%" stopColor="hsl(var(--heroui-primary-400))" stopOpacity="0" />
						</linearGradient>
					</defs>
					<rect width="100%" height="100%" fill="url(#pattern-melt)" />
					<rect width="100%" height="100%" fill="url(#fade-gradient)" />
				</svg>

				<div className="pt-20 sm:pt-28 pb-20 sm:pb-48 px-4 sm:px-5 w-full h-full flex flex-col gap-4 sm:gap-8 text-center max-w-xl sm:max-w-7xl mx-auto">
					<h1 className="text-4xl sm:text-6xl font-medium tracking-tighter text-balance text-primary-foreground z-10">
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
