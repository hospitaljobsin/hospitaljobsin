import type { CompanyDetailViewQuery } from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import CompanyDetailViewQueryNode from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import CompanyDetailViewClientComponent from "./CompanyDetailViewClientComponent";
import type { pageCompanyDetailFragment$key } from "./__generated__/pageCompanyDetailFragment.graphql";

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
const loadCompany = cache(async (slug: string) => {
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
	const preloadedQuery = await loadCompany(slug);

	const data = readInlineData<pageCompanyDetailFragment$key>(
		PageCompanyDetailFragment,
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

	const data = readInlineData<pageCompanyDetailFragment$key>(
		PageCompanyDetailFragment,
		preloadedQuery.data,
	);

	if (data.company.__typename !== "Company") {
		notFound();
	}

	return <CompanyDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
