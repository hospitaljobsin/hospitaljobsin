import { useFragment } from "react-relay";

import type { AccountDetailsFragment$key } from "@/__generated__/AccountDetailsFragment.graphql";
import {
	Avatar,
	Badge,
	Button,
	Card,
	CardHeader,
	Tooltip,
} from "@heroui/react";
import { EditIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
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
					<Badge
						placement="bottom-right"
						variant="solid"
						content={
							<Tooltip
								content={
									<div className="px-1 py-2 max-w-52 flex flex-col gap-2">
										<div className="text-small">
											Managed by{" "}
											<Link
												href="https://gravatar.com"
												className="text-primary"
												target="_blank"
											>
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
						<Avatar name={data.fullName} size="lg" src={data.avatarUrl} data-testid="account-avatar" />
					</Badge>
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
