"use client";
import ProfileViewSkeleton from "@/components/profile/ProfileViewSkeleton";
import dynamic from "next/dynamic";

const ProfileClientComponent = dynamic(
	() => import("./ProfileClientComponent"),
	{
		ssr: false,
		loading: () => <ProfileViewSkeleton />,
	},
);

export default function Profile() {
	return <ProfileClientComponent />;
}
