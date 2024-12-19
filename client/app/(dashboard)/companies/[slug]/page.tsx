import type { CompanyDetailViewQuery } from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import CompanyDetailViewQueryNode from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import CompanyDetailViewClientComponent from "./CompanyDetailViewClientComponent";

export const revalidate = 0;

// TODO: WHAT IF?
// we just use SSR for generating the metadata, and everything else is client side?
// need to see how and where generateMetadata is used/ invoked by Next.js

// Function to load and cache the query result
async function fetchAndCacheQuery(slug: string) {
	return await loadSerializableQuery<
		typeof CompanyDetailViewQueryNode,
		CompanyDetailViewQuery
	>(CompanyDetailViewQueryNode.params, {
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

		if (!response || response.data.company.__typename !== "Company") {
			notFound();
		}

		return {
			title: response.data.company.name,
			description: response.data.company.description,
			openGraph: {
				images: [response.data.company.logoUrl || "/default-image.img"],
			},
		};
	} catch (error) {
		console.log("Error in generateMetadata: ", error);
		notFound();
	}
}

export default async function CompanyDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await fetchAndCacheQuery(slug);

	return <CompanyDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
