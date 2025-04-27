import PasskeysSettingsView from "@/components/settings/passkeys/PasskeysSettingsView";
import PasskeysSettingsViewSkeleton from "@/components/settings/passkeys/PasskeysSettingsViewSkeleton";
import { Suspense } from "react";

export default function PasskeysSettingsPage() {
	return (
		<Suspense fallback={<PasskeysSettingsViewSkeleton />}>
			<PasskeysSettingsView />
		</Suspense>
	);
}
