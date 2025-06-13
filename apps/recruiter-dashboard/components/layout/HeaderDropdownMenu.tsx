import type { HeaderDropdownMenuFragment$key } from "@/__generated__/HeaderDropdownMenuFragment.graphql";
import useOrganization from "@/lib/hooks/useOrganization";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import OrganizationSwitcherList from "./OrganizationSwitcherList";

export const HeaderDropdownMenuFragment = graphql`
  fragment HeaderDropdownMenuFragment on Account {
	...OrganizationSwitcherListFragment
  }
`;

type Props = {
	account: HeaderDropdownMenuFragment$key;
};

export default function HeaderDropdownMenu({ account }: Props) {
	const data = useFragment(HeaderDropdownMenuFragment, account);
	const { organizationSlug } = useOrganization();

	return (
		<OrganizationSwitcherList account={data} currentSlug={organizationSlug} />
	);
}
