"use client";
import LandingViewSkeleton from "@/components/landing/LandingViewSkeleton";
import dynamic from "next/dynamic";

const LandingClientComponent = dynamic(
	() => import("./LandingClientComponent"),
	{
		ssr: false,
		loading: () => <LandingViewSkeleton />,
	},
);

export default function Landing() {
	return <LandingClientComponent />;
}
