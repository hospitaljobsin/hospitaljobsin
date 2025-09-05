import OrganizationSkeleton from "./OrganizationSkeleton";

export default function OrganizationListSkeleton({
	count = 8,
}: {
	count?: number;
}) {
	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			{Array.from({ length: count }).map((_, index) => (
				<OrganizationSkeleton key={`organization-skeleton-${index}`} />
			))}
		</div>
	);
}
