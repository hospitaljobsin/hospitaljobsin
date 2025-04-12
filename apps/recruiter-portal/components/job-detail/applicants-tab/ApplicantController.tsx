import type { ApplicantControllerFragment$key } from "@/__generated__/ApplicantControllerFragment.graphql";
import links from "@/lib/links";
import { Button, Input, Link } from "@heroui/react";
import { BriefcaseBusiness, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

interface ApplicantControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	rootQuery: ApplicantControllerFragment$key;
}

const ApplicantControllerFragment = graphql`
	fragment ApplicantControllerFragment on Job {
			__typename
		}
`;

export default function ApplicantController(props: ApplicantControllerProps) {
	const { slug } = useParams<{ slug: string }>();
	const data = useFragment(ApplicantControllerFragment, props.rootQuery);

	return (
		<div className="w-full flex flex-col sm:flex-row items-center gap-8">
			<Input
				classNames={{
					inputWrapper: "bg-background shadow-none",
				}}
				startContent={
					<Search
						size={20}
						className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-4"
					/>
				}
				isClearable
				placeholder="Find an applicant..."
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>
			{/* TODO: add sorting controls here */}
			<Button
				as={Link}
				href={links.organizationCreateJob(slug)}
				color="primary"
				startContent={<BriefcaseBusiness size={25} />}
				className="w-full sm:w-auto"
			>
				New
			</Button>
		</div>
	);
}
