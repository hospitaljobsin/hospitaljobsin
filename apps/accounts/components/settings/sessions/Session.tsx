import { Card, CardHeader } from "@heroui/react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { SessionFragment$key } from "./__generated__/SessionFragment.graphql";

export const SessionFragment = graphql`
  fragment SessionFragment on Session {
	userAgent
    createdAt
    isCurrentSession
  }
`;

type Props = {
	session: SessionFragment$key;
};

export default function Session({ session }: Props) {
	const data = useFragment(SessionFragment, session);

	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardHeader>
				<p>{data.userAgent}</p>
				<p>{data.createdAt}</p>
				<p>{data.isCurrentSession}</p>
			</CardHeader>
		</Card>
	);
}
