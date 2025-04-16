import AppliedView from "@/components/my-jobs/applied/AppliedView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Applied Jobs",
};

export default function AppliedJobsPage() {
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<AppliedView />
		</div>
	);
}
