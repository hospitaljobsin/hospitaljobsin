import InviteSkeleton from "./InviteSkeleton";

export default function OrganizationInvitesListSkeleton() {
	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{Array.from({ length: 8 }).map((_, index) => (
				<InviteSkeleton key={`member-skeleton-${index}`} />
			))}
		</div>
	);
}
