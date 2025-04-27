import DashboardView from "@/components/dashboard/DashboardView";
import DashboardViewSkeleton from "@/components/dashboard/DashboardViewSkeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardViewSkeleton />}>
			<DashboardView />
		</Suspense>
	);
}
