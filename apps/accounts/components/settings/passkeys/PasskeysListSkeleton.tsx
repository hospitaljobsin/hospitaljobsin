import PasskeySkeleton from "./PasskeySkeleton";
import PasskeysControllerSkeleton from "./PasskeysControllerSkeleton";

export default function PasskeysListSkeleton() {
	return (
		<div className="w-full flex flex-col gap-6">
			<div className="flex w-full items-center justify-between gap-6">
				<p className="text-foreground-600">My Passkeys</p>
				<PasskeysControllerSkeleton />
			</div>
			<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
				{Array.from({ length: 8 }).map((_, index) => (
					<PasskeySkeleton key={`Passkey-skeleton-${index}`} />
				))}
			</div>
		</div>
	);
}
