import SavedView from "@/components/saved/SavedView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Saved Jobs",
};

export default function Saved() {
	return (
		<div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col gap-8">
			<SavedView />
		</div>
	);
}
