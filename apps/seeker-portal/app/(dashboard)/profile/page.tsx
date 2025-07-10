"use client";
import ProfileClientComponent from "./ProfileClientComponent";

export default function Profile() {
	return <ProfileClientComponent />;
	// return (
	// 	<Suspense fallback={<ProfileViewSkeleton />}>
	// 		<ProfileClientComponent queryReference={queryReference} />
	// 	</Suspense>
	// );
}
