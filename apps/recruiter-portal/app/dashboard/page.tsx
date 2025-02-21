import DashboardView from "@/components/dashboard/DashboardView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default function DashboardPage() {
	return <DashboardView />;
}
