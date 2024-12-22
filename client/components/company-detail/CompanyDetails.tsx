import { Avatar, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Globe, MailIcon, MapPin, Phone } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import type { CompanyDetailsFragment$key } from "./__generated__/CompanyDetailsFragment.graphql";
import type { CompanyDetailsInternalFragment$key as CompanyDetailsInternalFragmentType } from "./__generated__/CompanyDetailsInternalFragment.graphql";

const CompanyDetailsFragment = graphql`
  fragment CompanyDetailsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    company(slug: $slug) {
      __typename
      ... on Company {
        ...CompanyDetailsInternalFragment
      }
	 
    }
  }
`;
const CompanyDetailsInternalFragment = graphql`
  fragment CompanyDetailsInternalFragment on Company {
    name
    logoUrl
    description
    website
    phone
    email
    address {
      city
      state
    }
  }
`;

export default function CompanyDetails({
	rootQuery,
}: { rootQuery: CompanyDetailsFragment$key }) {
	const root = useFragment(CompanyDetailsFragment, rootQuery);
	invariant(
		root.company.__typename === "Company",
		"Expected 'Company' node type",
	);
	const data = useFragment<CompanyDetailsInternalFragmentType>(
		CompanyDetailsInternalFragment,
		root.company,
	);

	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-6 space-y-6" shadow="sm">
				<CardHeader>
					<div className="flex w-full justify-between gap-4 items-center">
						<div className="flex gap-6 items-center">
							<Avatar
								name={data.name}
								src={data.logoUrl || undefined}
								size="lg"
								className="h-20 w-20"
							/>
							<div className="flex flex-col gap-3 items-start">
								<h4 className="text-xl font-medium">{data.name}</h4>

								<p className="text-md font-normal text-foreground-500">
									{data.description}
								</p>
							</div>
						</div>
						<Button size="lg">Follow</Button>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 w-full">
					<div className="flex flex-wrap gap-8 items-center text-foreground-600 w-full">
						<div className="flex items-center gap-2">
							<MapPin size={16} />{" "}
							{`${data.address.city}, ${data.address.state}`}
						</div>
						<div className="flex items-center gap-2">
							<MailIcon size={16} /> {data.email}
						</div>
						<div className="flex items-center gap-2">
							<Phone size={16} /> {data.phone}
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
