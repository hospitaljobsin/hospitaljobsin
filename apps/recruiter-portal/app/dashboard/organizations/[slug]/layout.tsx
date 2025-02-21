import OrganizationTabs from "@/components/organization-detail/OrganizationTabs";

export default function OrganizationDetailLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="py-4 w-full h-full flex flex-col items-center gap-2">
			<OrganizationTabs />
			{children}
		</div>
	);
}
