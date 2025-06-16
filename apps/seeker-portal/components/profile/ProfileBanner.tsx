import type { ProfileBannerFragment$key } from "@/__generated__/ProfileBannerFragment.graphql";
import { getRelativeTimeString } from "@/lib/intl";
import links from "@/lib/links";
import { Avatar, Card, CardBody, Link } from "@heroui/react";
import { graphql, useFragment } from "react-relay";

const ProfileBannerFragment = graphql`
fragment ProfileBannerFragment on Account {
    fullName
    avatarUrl
	profile @required(action: THROW) {
		updatedAt
	}
}
`;

type Props = {
	account: ProfileBannerFragment$key;
};

export default function ProfileBanner({ account }: Props) {
	const data = useFragment(ProfileBannerFragment, account);
	return (
		<Card className="w-full p-0 overflow-visible" shadow="none">
			<div className="relative w-full">
				{/* Banner */}
				<div className="w-full h-32 bg-primary-300 rounded-t-lg" />
				{/* Avatar and Name */}
				<div className="absolute left-6 -bottom-10 flex items-end gap-4">
					<Avatar
						src={data.avatarUrl}
						size="lg"
						className="ring-4 ring-background w-28 h-28 text-4xl"
					/>
				</div>
			</div>
			<CardBody className="pt-14 pb-6 px-6">
				<div className="flex items-start justify-between w-full">
					<div className="flex flex-col gap-2">
						<h1 className="text-2xl font-medium">{data.fullName}'s</h1>
						<div className="flex flex-col gap-4">
							<p className="text-sm">
								Reusable job profile, used across all applications.
							</p>
							<p className="text-foreground-500 text-sm mt-1">
								Last updated {getRelativeTimeString(data.profile.updatedAt)}
							</p>
						</div>
					</div>
					<Link
						href={links.accountSettings}
						color="foreground"
						showAnchorIcon
						isExternal
					>
						Account Settings
					</Link>
				</div>
			</CardBody>
		</Card>
	);
}
