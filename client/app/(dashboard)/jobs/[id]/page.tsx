import type { JobDetailViewQuery } from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import JobDetailViewQueryNode from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import type { ConcreteRequest } from "relay-runtime";
import JobDetailViewClientComponent from "./JobDetailViewClientComponent";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return {
		title: "Job Name",
		description: "Job description",
		openGraph: {
			images: ["/some-specific-page-image.jpg"],
		},
	};
}

export default async function JobDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const jobId = (await params).id;

	let preloadedQuery: SerializablePreloadedQuery<
		ConcreteRequest,
		JobDetailViewQuery
	>;

	try {
		preloadedQuery = await loadSerializableQuery<
			typeof JobDetailViewQueryNode,
			JobDetailViewQuery
		>(JobDetailViewQueryNode.params, {
			jobId: decodeURIComponent(jobId),
		});
	} catch (error) {
		console.log("error: ", error);
		// gracefully handle errors
		notFound();
	}

	if (
		!preloadedQuery.response.data.node ||
		preloadedQuery.response.data.node.__typename !== "Job"
	) {
		notFound();
	}

	return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}

export const revalidate = 0;
