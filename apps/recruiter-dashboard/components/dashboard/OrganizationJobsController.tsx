import type { OrganizationJobsControllerFragment$key } from "@/__generated__/OrganizationJobsControllerFragment.graphql";
import { useCopilotChatLogic } from "@/lib/hooks/useCopilotChatLogic";
import { CREATE_NEW_JOB_PROMPT } from "@/lib/prompts";
import { Button, Input } from "@heroui/react";
import { BriefcaseBusiness, Search } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import { useMessageViewer } from "../MessageViewerProvider";

interface OrganizationJobsControllerProps {
	searchTerm: string | null;
	setSearchTerm: (searchTerm: string | null) => void;
	rootQuery: OrganizationJobsControllerFragment$key;
}

const OrganizationJobsControllerFragment = graphql`
	fragment OrganizationJobsControllerFragment on Query
	@argumentDefinitions(
		slug: { type: "String!" }
	) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				isAdmin
			}
		}
	}
`;

export default function OrganizationJobsController(
	props: OrganizationJobsControllerProps,
) {
	const { sendMessage, isLoading } = useCopilotChatLogic();
	const { setShowMessageViewer } = useMessageViewer();
	const data = useFragment(OrganizationJobsControllerFragment, props.rootQuery);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' type.",
	);

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
				placeholder="Find a job posting..."
				variant="bordered"
				value={props.searchTerm || ""}
				onValueChange={(value) => props.setSearchTerm(value)}
				onClear={() => props.setSearchTerm(null)}
				fullWidth
			/>
			{data.organization.isAdmin && (
				<Button
					isDisabled={isLoading}
					onPress={async () => {
						setShowMessageViewer(true);
						await sendMessage(CREATE_NEW_JOB_PROMPT);
					}}
					color="primary"
					startContent={<BriefcaseBusiness size={25} />}
					className="w-full sm:w-auto"
				>
					New
				</Button>
			)}
		</div>
	);
}
