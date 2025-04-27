"use client";
import SessionsListSkeleton from "./SessionsListSkeleton";

export default function SessionsSettingsViewSkeleton() {
	return (
		<div className="w-full h-full space-y-6">
			<SessionsListSkeleton />
		</div>
	);
}
