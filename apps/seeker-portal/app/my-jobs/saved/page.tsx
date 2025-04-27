import SavedView from "@/components/my-jobs/saved/SavedView";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Saved Jobs",
};

export default function SavedJobsPage() {
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<Suspense>
				<SavedView />
			</Suspense>
		</div>
	);
}
