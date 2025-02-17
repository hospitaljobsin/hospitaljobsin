import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Globe, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import type { OrganizationDetailsFragment$key } from "./__generated__/OrganizationDetailsFragment.graphql";
import type { OrganizationDetailsInternalFragment$key as OrganizationDetailsInternalFragmentType } from "./__generated__/OrganizationDetailsInternalFragment.graphql";

const OrganizationDetailsFragment = graphql`
  fragment OrganizationDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    organization(slug: $slug) {
      __typename
      ... on Organization {
        ...OrganizationDetailsInternalFragment
      }
	 
    }
  }
`;
const OrganizationDetailsInternalFragment = graphql`
  fragment OrganizationDetailsInternalFragment on Organization {
    name
    logoUrl
    description
    website
    email
    address {
      city
      state
    }
  }
`;

export default function OrganizationDetails({
	rootQuery,
}: { rootQuery: OrganizationDetailsFragment$key }) {
	const root = useFragment(OrganizationDetailsFragment, rootQuery);
	invariant(
		root.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	const data = useFragment<OrganizationDetailsInternalFragmentType>(
		OrganizationDetailsInternalFragment,
		root.organization,
	);

	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex w-full justify-between gap-4 sm:items-center flex-col sm:flex-row items-start">
						<div className="flex gap-6 items-center">
							<Image
								src={data.logoUrl || ""}
								alt={data.name}
								width={75}
								height={75}
							/>
							<div className="flex flex-col gap-3 items-start">
								<h4 className="text-xl font-medium">{data.name}</h4>

								<p className="text-md font-normal text-foreground-500">
									{data.description}
								</p>
							</div>
						</div>
						<Button size="lg" className="w-full sm:w-auto">
							Follow
						</Button>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 w-full">
					<div className="flex flex-wrap gap-8 items-center text-foreground-600 w-full">
						<div className="flex items-center gap-2">
							<MapPin size={16} />{" "}
							{`${data.address.city}, ${data.address.state}`}
						</div>
						<div className="flex items-center gap-2">
							<Mail size={16} /> {data.email}
						</div>
						<div className="flex items-center gap-2">
							<Globe size={16} /> {data.website}
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
