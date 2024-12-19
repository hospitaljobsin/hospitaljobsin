import type { JobDetailViewQuery } from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import JobDetailViewQueryNode from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import JobDetailViewClientComponent from "./JobDetailViewClientComponent";

export const dynamic = "force-dynamic";

async function fetchAndCacheQuery(slug: string) {
	return await loadSerializableQuery<
		typeof JobDetailViewQueryNode,
		JobDetailViewQuery
	>(JobDetailViewQueryNode.params, {
		slug: slug,
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	try {
		const preloadedQuery = await fetchAndCacheQuery(slug);

		const response = preloadedQuery.response;

		if (!response || response.data.job.__typename !== "Job") {
			notFound();
		}

		return {
			title: response.data.job.title,
			description: response.data.job.description,
			openGraph: {
				images: [response.data.job.company?.logoUrl || "/default-image.img"],
			},
		};
	} catch (error) {
		console.log("Error in generateMetadata: ", error);
		notFound();
	}
}

export default async function JobDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await fetchAndCacheQuery(slug);

	return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}

export const revalidate = 0;
