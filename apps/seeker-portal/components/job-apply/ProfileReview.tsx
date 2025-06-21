"use client";
import type { ProfileReviewFragment$key } from "@/__generated__/ProfileReviewFragment.graphql";
import links from "@/lib/links";
import { Button, Card, CardHeader } from "@heroui/react";
import { EditIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { graphql, useFragment } from "react-relay";

const ProfileReviewFragment = graphql`
	fragment ProfileReviewFragment on Account {
		__typename
	}
`;

export default function ProfileReview(props: {
	account: ProfileReviewFragment$key;
}) {
	const account = useFragment(ProfileReviewFragment, props.account);

	return (
		<Card className="w-full p-6" shadow="none">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
				<div className="w-full flex flex-col gap-4">
					<div className="text-lg font-medium flex items-center gap-2">
						<UserIcon size={24} /> <h2>Profile Review</h2>
					</div>
					<h3>Ensure your profile is up-to-date before applying to this job</h3>
					<h3 className="text-foreground-500">
						(This cannot be changed later)
					</h3>
				</div>
				<Button
					variant="bordered"
					as={Link}
					href={links.profile}
					startContent={<EditIcon size={24} />}
					className="px-0 min-w-48"
					size="lg"
				>
					Update Profile
				</Button>
			</CardHeader>
		</Card>
	);
}
