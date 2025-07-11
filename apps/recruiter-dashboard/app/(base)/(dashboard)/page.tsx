"use client";
import DashboardViewSkeleton from "@/components/dashboard/DashboardViewSkeleton";
import dynamic from "next/dynamic";

const DashboardClientComponent = dynamic(
	() => import("./DashboardClientComponent"),
	{
		ssr: false,
		loading: () => <DashboardViewSkeleton />,
	},
);
export default function DashboardPage() {
	return <DashboardClientComponent />;
}
