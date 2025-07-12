import links from "@/lib/links";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import OrganizationSkeleton from "./OrganizationSkeleton";

export default function OrganizationListSkeleton({
	count = 8,
}: {
	count?: number;
}) {
	return (
		<div className="w-full h-full flex flex-col gap-4 sm:gap-8 pb-4 sm:pb-6">
			<div className="flex w-full gap-6 justify-between items-center">
				<div className="flex gap-4 items-center text-foreground-600">
					<h2 className="text-base font-medium">Select an organization</h2>
				</div>
				<Button
					as={Link}
					href={links.createOrganization()}
					startContent={<PlusIcon className="h-4 w-4" />}
				>
					Create Organization
				</Button>
			</div>
			{Array.from({ length: count }).map((_, index) => (
				<OrganizationSkeleton key={`organization-skeleton-${index}`} />
			))}
		</div>
	);
}
