import type { OrganizationFragment$key } from "@/__generated__/OrganizationFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardHeader } from "@heroui/react";
import Image from "next/image";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const OrganizationFragment = graphql`
  fragment OrganizationFragment on Organization {
	name
    logoUrl
    slug
    description
  }
`;

type Props = {
	organization: OrganizationFragment$key;
};

export default function Organization({ organization }: Props) {
	const router = useRouter();
	const data = useFragment(OrganizationFragment, organization);

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(links.organizationDetail(data.slug));
			}}
			shadow="none"
		>
			<CardHeader>
				<div className="flex flex-col sm:flex-row w-full justify-between gap-6 items-start sm:items-center">
					<div className="flex items-center gap-4">
						<div className="relative h-14 w-14">
							<Image
								src={data.logoUrl || ""}
								alt={data.name}
								fill
								className="rounded-md object-cover"
							/>
						</div>
						<div className="flex flex-col gap-2 items-start">
							<h4 className="text-lg sm:text-xl font-medium">{data.name}</h4>
							<p className="text-sm sm:text-base font-normal text-foreground-500">
								{data.description}
							</p>
						</div>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}
