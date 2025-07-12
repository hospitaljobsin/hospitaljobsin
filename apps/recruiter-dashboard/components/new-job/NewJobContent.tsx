import NewJobClientComponentQueryType, {
	type NewJobClientComponentQuery,
} from "@/__generated__/NewJobClientComponentQuery.graphql";
import type { NewJobContentFragment$key } from "@/__generated__/NewJobContentFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "next/navigation";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import NotFoundView from "../NotFoundView";
import JobCreationForm from "./JobCreationForm";

export const NewJobContentFragment = graphql`
	fragment NewJobContentFragment on Query @argumentDefinitions(slug: { type: "String!" }) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				isAdmin
				...JobCreationFormFragment
			}
		}
	}
`;

export default function NewJobContent({
	initialQueryRef,
}: { initialQueryRef: PreloadedQuery<NewJobClientComponentQuery> }) {
	const router = useRouter();
	const data = usePreloadedQuery(
		NewJobClientComponentQueryType,
		initialQueryRef,
	);
	const orgData = useFragment<NewJobContentFragment$key>(
		NewJobContentFragment,
		data,
	);

	if (
		orgData.organization.__typename !== "Organization" ||
		!orgData.organization.isAdmin
	) {
		return <NotFoundView />;
	}

	return (
		<div className="w-full h-full flex justify-center items-start pl-6">
			<JobCreationForm
				organization={orgData.organization}
				onSuccess={(slug: string) =>
					router.push(links.jobDetailApplicants(slug))
				}
			/>
		</div>
	);
}
