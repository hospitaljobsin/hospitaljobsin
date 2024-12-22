import { useFragment } from "react-relay";

import { getGravatarURL } from "@/lib/avatars";
import { Avatar, Badge, Card, CardHeader, Tooltip } from "@nextui-org/react";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { graphql } from "relay-runtime";
import type { ProfileHeaderFragment$key } from "./__generated__/ProfileHeaderFragment.graphql";

const ProfileHeaderFragment = graphql`
  fragment ProfileHeaderFragment on Account {
    fullName
    email
  }
`;

type Props = {
	rootQuery: ProfileHeaderFragment$key;
};

export default function ProfileHeader({ rootQuery }: Props) {
	const data = useFragment(ProfileHeaderFragment, rootQuery);

	return (
		<Card className="p-6 space-y-6" shadow="sm">
			<CardHeader className="flex gap-6 w-full items-center justify-start">
				<Badge
					variant="solid"
					content={
						<Tooltip
							content={
								<div className="px-1 py-2 max-w-52 flex flex-col gap-2">
									<div className="text-small">
										Managed by{" "}
										<Link href="https://gravatar.com" className="text-primary">
											Gravatar
										</Link>
									</div>
									<div className="text-tiny">
										Update your image by changing it on your Gravatar account!
									</div>
								</div>
							}
						>
							<InfoIcon size={18} />
						</Tooltip>
					}
					size="md"
					shape="circle"
					showOutline={false}
				>
					<Avatar
						name={data.fullName}
						size="lg"
						src={getGravatarURL(data.email)}
					/>
				</Badge>
				<div className="flex flex-col gap-2 w-full items-center justify-start">
					<h1 className="w-full text-lg font-medium">{data.fullName}</h1>
					<h1 className="w-full">{data.email}</h1>
				</div>
			</CardHeader>
		</Card>
	);
}
