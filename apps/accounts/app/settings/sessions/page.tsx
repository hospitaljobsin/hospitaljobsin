import SessionsSettingsView from "@/components/settings/sessions/SessionsSettingsView";
import SessionsSettingsViewSkeleton from "@/components/settings/sessions/SessionsSettingsViewSkeleton";
import { Suspense } from "react";

export default function SessionsSettingsPage() {
	return (
		<Suspense fallback={<SessionsSettingsViewSkeleton />}>
			<SessionsSettingsView />
		</Suspense>
	);
}
