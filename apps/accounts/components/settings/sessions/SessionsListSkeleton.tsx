import SessionSkeleton from "./SessionSkeleton";

export default function SessionsListSkeleton() {
	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			{Array.from({ length: 8 }).map((_, index) => (
				<SessionSkeleton key={`Session-skeleton-${index}`} />
			))}
		</div>
	);
}
