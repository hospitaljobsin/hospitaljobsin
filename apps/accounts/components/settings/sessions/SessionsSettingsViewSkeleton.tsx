"use client";
import SessionsControllerSkeleton from "./SessionsControllerSkeleton";
import SessionsListSkeleton from "./SessionsListSkeleton";

export default function SessionsSettingsViewSkeleton() {
	return (
		<div className="w-full h-full space-y-6">
			<div className="w-full flex flex-col gap-6">
				<div className="flex w-full items-center justify-between gap-6">
					<p className="text-foreground-600">My Sessions</p>
					<SessionsControllerSkeleton />
				</div>
				<SessionsListSkeleton />
			</div>
		</div>
	);
}
