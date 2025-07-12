"use client";
import NewOrganizationView from "@/components/new-organization/NewOrganizationView";

export default function NewOrganizationClientComponent() {
	return (
		<div className="py-8 w-full h-full flex flex-col gap-8">
			<NewOrganizationView />
		</div>
	);
}
