import type { CompanyDetailViewQuery } from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import CompanyDetailViewQueryNode from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import CompanyDetailViewClientComponent from "./CompanyDetailViewClientComponent";
import type { pageCompanyDetailFragment$key } from "./__generated__/pageCompanyDetailFragment.graphql";

// TODO: WHAT IF?
// we just use SSR for generating the metadata, and everything else is client side?
// need to see how and where generateMetadata is used/ invoked by Next.js

const PageCompanyDetailFragment = graphql`
 fragment pageCompanyDetailFragment on Query @inline @argumentDefinitions(
	  slug: {
		type: "String!",
	  }
	) {
	company(slug: $slug) {
	  __typename
	  ... on Company {
		name
		description
		logoUrl
	  }
	 
	}
  }
`;

// Function to load and cache the query result
const fetchAndCacheQuery = cache(async (slug: string) => {
	console.log("fetching company...");
	return await loadSerializableQuery<
		typeof CompanyDetailViewQueryNode,
		CompanyDetailViewQuery
	>(CompanyDetailViewQueryNode, {
		slug: slug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	try {
		const preloadedQuery = await fetchAndCacheQuery(slug);

		const data = readInlineData<pageCompanyDetailFragment$key>(
			PageCompanyDetailFragment,
			preloadedQuery.data,
		);

		if (data.company.__typename !== "Company") {
			notFound();
		}

		return {
			title: data.company.name,
			description: data.company.description,
			openGraph: {
				images: [data.company.logoUrl || "/default-image.img"],
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
