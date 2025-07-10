"use client";
import type { LandingViewFragment$key } from "@/__generated__/LandingViewFragment.graphql";
import { TrendingUpIcon } from "lucide-react";
import { Suspense } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import LandingHeader from "../layout/LandingHeader";
import LandingHeaderSkeleton from "../layout/LandingHeaderSkeleton";
import JobList from "./JobList";
import JobListSkeleton from "./JobListSkeleton";
import { LandingSearchController } from "./LandingSearchController";

const LandingViewFragment = graphql`
  fragment LandingViewFragment on Query   @argumentDefinitions(
    searchTerm: { type: "String" }
    coordinates: { type: "CoordinatesInput"}
    proximityKm: { type: "Float" }
  ) {
    ...JobListFragment @arguments(searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm)
	...LandingHeaderFragment
  }
`;

export default function LandingView({
	query,
}: {
	query: LandingViewFragment$key;
}) {
	const data = useFragment(LandingViewFragment, query);

	return (
		<div className="w-full flex flex-col bg-background-600 h-full">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-primary-600 via-primary-400 to-primary-300 flex flex-col justify-center items-center w-full">
				<Suspense fallback={<LandingHeaderSkeleton />}>
					<LandingHeader rootQuery={data} />
				</Suspense>
				{/* Background SVG or Image Placeholder */}
				<div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none z-0">
					{/* TODO: Replace with a beautiful healthcare-themed SVG or image */}
					<svg
						viewBox="0 0 1440 320"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-full"
					>
						<title>Healthcare background wave</title>
						<path
							fill="#fff"
							fillOpacity="0.2"
							d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
						/>
					</svg>
				</div>
				{/* Main content: text left, image right */}
				<div className="relative z-10 flex flex-col md:flex-row md:items-end text-center md:text-left gap-8 pt-8 sm:pt-24 px-4 max-w-7xl w-full h-full">
					{/* Left: Text and Search */}
					<div className="flex-1 flex flex-col items-center md:items-start gap-6 pb-16">
						<h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-primary-foreground drop-shadow-lg hidden md:block">
							Empowering{" "}
							<span className="text-accent-400">Healthcare Heroes</span>
							<br />
							to Find Their Next{" "}
							<span className="text-accent-400">Opportunity</span>
						</h1>
						<p className="text-lg sm:text-2xl text-primary-foreground/90 font-medium max-w-xl mx-auto md:mx-0 hidden md:block">
							Discover life-changing roles at top hospitals and clinics. Your
							next mission starts here.
						</p>
						<div className="w-full flex flex-col items-center md:items-start gap-4">
							<LandingSearchController />
						</div>
					</div>
					{/* Right: Doctor Image */}
					<div className="flex-1 md:flex items-end w-auto h-[600px] hidden relative">
						<img
							src="/hero-model.png"
							alt="Group of doctors smiling, representing healthcare professionals"
							className="w-auto h-full max-w-full object-cover object-bottom absolute left-0 top-0 z-10"
							loading="eager"
						/>
						<img
							src="/hero-model-2.png"
							alt="Group of doctors smiling, representing healthcare professionals"
							className="w-auto h-full max-w-full object-cover object-bottom absolute drop-shadow-lg left-56 z-20 hidden xl:block"
							loading="eager"
						/>
					</div>
				</div>
			</div>

			{/* Trending Jobs Section */}
			<div className="py-8 sm:py-16 flex flex-col gap-8 max-w-7xl w-full px-4 sm:px-5 mx-auto bg-background-600">
				<div className="w-full flex flex-col gap-4 items-center justify-center">
					<div className="flex flex-col gap-4 w-full py-8">
						<div className="flex items-center gap-4 w-full">
							<TrendingUpIcon className="text-foreground-600 w-7 h-7" />
							<h2 className="text-xl sm:text-2xl font-medium text-foreground-600 tracking-tight">
								Trending Jobs
							</h2>
						</div>
						<h3 className="text-foreground-500 text-base sm:text-lg font-medium tracking-tight">
							Most Viewed Healthcare Jobs This Week
						</h3>
					</div>
					<Suspense fallback={<JobListSkeleton />}>
						<JobList rootQuery={data} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
