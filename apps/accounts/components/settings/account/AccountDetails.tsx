import type { AccountDetailsFragment$key } from "@/__generated__/AccountDetailsFragment.graphql";
import { Avatar, Button, Card, CardHeader } from "@heroui/react";
import { EditIcon } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const AccountDetailsFragment = graphql`
  fragment AccountDetailsFragment on Account {
    fullName
    email
	avatarUrl(size: 120)
  }
`;

type Props = {
	rootQuery: AccountDetailsFragment$key;
	onEditAccount: () => void;
};

export default function AccountDetails({ rootQuery, onEditAccount }: Props) {
	const data = useFragment(AccountDetailsFragment, rootQuery);

	return (
		<Card className="p-6 space-y-6" shadow="none">
			<CardHeader className="flex flex-col sm:flex-row gap-6 w-full items-end sm:items-center justify-between">
				<div className="flex gap-6 w-full items-center justify-start">
					<Avatar
						showFallback
						name={data.fullName}
						size="lg"
						src={data.avatarUrl}
						data-testid="account-avatar"
						className="min-w-16 min-h-16"
					/>
					<div className="flex flex-col gap-2 w-full items-start justify-center">
						<h1 className="w-full text-lg font-medium truncate max-w-64">
							{data.fullName}
						</h1>
						<h1 className="w-full truncate max-w-48 sm:max-w-64">
							{data.email}
						</h1>
					</div>
				</div>
				<Button
					startContent={<EditIcon size={24} />}
					onPress={onEditAccount}
					variant="light"
				>
					Edit
				</Button>
			</CardHeader>
		</Card>
	);
}
