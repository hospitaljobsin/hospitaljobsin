import LandingView from "@/components/landing/LandingView";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Landing() {

  return (
    <div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col gap-8">
      <h1 className="text-5xl text-center w-full max-w-4xl text-balance mx-auto py-12">
        Find Your Perfect Fit in Medicine: Explore Top Healthcare Careers
      </h1>
      {/* <LandingViewSkeleton /> */}
      <Suspense fallback={<LandingViewSkeleton />}>
        <LandingView />
      </Suspense>
    </div>
  );
}
