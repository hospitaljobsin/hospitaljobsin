import ProfileView from "@/components/profile/ProfileView";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Profile() {
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<Suspense>
				<ProfileView />
			</Suspense>
		</div>
	);
}
