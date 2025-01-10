import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import CompanyDetailViewClientComponent from "./CompanyDetailViewClientComponent";
import type { pageCompanyDetailMetadataFragment$key } from "./__generated__/pageCompanyDetailMetadataFragment.graphql";
import type CompanyDetailViewQueryNode from "./__generated__/pageCompanyDetailViewQuery.graphql";
import type { pageCompanyDetailViewQuery } from "./__generated__/pageCompanyDetailViewQuery.graphql";

export const PageCompanyDetailViewQuery = graphql`
  query pageCompanyDetailViewQuery($slug: String!) {	
	...pageCompanyDetailMetadataFragment @arguments(slug: $slug)
    ...CompanyDetailViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageCompanyDetailMetadataFragment = graphql`
 fragment pageCompanyDetailMetadataFragment on Query @inline @argumentDefinitions(
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
const loadCompany = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof CompanyDetailViewQueryNode,
		pageCompanyDetailViewQuery
	>(PageCompanyDetailViewQuery, {
		slug: slug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const preloadedQuery = await loadCompany(slug);

	const data = readInlineData<pageCompanyDetailMetadataFragment$key>(
		PageCompanyDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (data.company.__typename !== "Company") {
		return {
			title: "Company Not found",
			description: "The company you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: data.company.name,
		description: data.company.description,
		openGraph: {
			images: [data.company.logoUrl || "/default-image.img"],
		},
	};
}

export default async function CompanyDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadCompany(slug);

	const data = readInlineData<pageCompanyDetailMetadataFragment$key>(
		PageCompanyDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (data.company.__typename !== "Company") {
		notFound();
	}

	return <CompanyDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
