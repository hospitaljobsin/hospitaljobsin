import AccountSettingsView from "@/components/settings/account/AccountSettingsView";
import AccountSettingsViewSkeleton from "@/components/settings/account/AccountSettingsViewSkeleton";
import { Suspense } from "react";

export default function AccountSettingsPage() {
	return (
		<Suspense fallback={<AccountSettingsViewSkeleton />}>
			<AccountSettingsView />
		</Suspense>
	);
}
