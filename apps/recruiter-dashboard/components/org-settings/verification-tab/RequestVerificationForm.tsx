import type { RequestVerificationFormFragment$key } from "@/__generated__/RequestVerificationFormFragment.graphql";
import { graphql, useFragment } from "react-relay";

const RequestVerificationFormFragment = graphql`
	fragment RequestVerificationFormFragment on Organization {
        __typename
	}
`;
export default function RequestVerificationForm({
	organization,
}: {
	organization: RequestVerificationFormFragment$key;
}) {
	const data = useFragment(RequestVerificationFormFragment, organization);
	return <div>RequestVerificationForm</div>;
}
