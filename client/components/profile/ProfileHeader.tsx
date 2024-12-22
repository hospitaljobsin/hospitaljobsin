import { useFragment } from "react-relay";

import { getGravatarURL } from "@/lib/avatars";
import { Avatar, Card, CardHeader } from "@nextui-org/react";
import { EditIcon } from "lucide-react";
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
				<Avatar
					name={data.fullName}
					size="lg"
					src={getGravatarURL(data.email)}
				/>
				<div className="flex flex-col gap-2 w-full items-center justify-start">
					<h1 className="w-full text-lg font-medium flex items-center gap-4">
						{data.fullName} <EditIcon size={20} />
					</h1>
					<h1 className="w-full">{data.email}</h1>
				</div>
			</CardHeader>
		</Card>
	);
}
