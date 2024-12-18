import type { CompanyDetailViewQuery } from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import CompanyDetailViewQueryNode from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import { networkFetch } from "@/lib/relay/environment";
import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import type { ConcreteRequest } from "relay-runtime";
import CompanyDetailViewClientComponent from "./CompanyDetailViewClientComponent";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const response = await networkFetch(CompanyDetailViewQueryNode.params, {
		slug: slug,
	});

	return {
		title: response.data.company.name,
		description: response.data.company.description,
		openGraph: {
			images: [response.data.company.logoUrl || "/default-image.img"],
		},
	};
}

export default async function CompanyDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	let preloadedQuery: SerializablePreloadedQuery<
		ConcreteRequest,
		CompanyDetailViewQuery
	>;

	try {
		preloadedQuery = await loadSerializableQuery<
			typeof CompanyDetailViewQueryNode,
			CompanyDetailViewQuery
		>(CompanyDetailViewQueryNode.params, {
			slug: slug,
		});
	} catch (error) {
		console.log("error: ", error);
		// gracefully handle errors
		notFound();
	}

	if (preloadedQuery.response.data.company.__typename !== "Company") {
		notFound();
	}

	return <CompanyDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}

export const revalidate = 0;
