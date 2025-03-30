import MemberSkeleton from "./MemberSkeleton";

export default function OrganizationMembersListSkeleton() {
	return (
		<div className="w-full flex flex-col gap-8 pb-6">
			{Array.from({ length: 8 }).map((_, index) => (
				<MemberSkeleton key={`member-skeleton-${index}`} />
			))}
		</div>
	);
}