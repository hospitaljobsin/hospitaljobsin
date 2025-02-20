import DashboardView from "@/components/dashboard/DashboardView";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default function DashboardPage() {
	return (
		<>
			<div className="py-4 sm:py-8 flex flex-col gap-4 sm:gap-8 max-w-5xl px-4 sm:px-5 mx-auto">
				<DashboardView />
			</div>
		</>
	);
}
