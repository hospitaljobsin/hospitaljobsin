import CompanyDetailViewQueryNode, {
    CompanyDetailViewQuery,
} from "@/components/company-detail/__generated__/CompanyDetailViewQuery.graphql";
import loadSerializableQuery, {
    SerializablePreloadedQuery,
} from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { ConcreteRequest } from "relay-runtime";
import CompanyDetailViewClientComponent from "./CompanyDetailViewClientComponent";
  
  export const dynamic = "force-dynamic"
  
  export default async function CompanyDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const companyId = (await params).id;
  
    let preloadedQuery: SerializablePreloadedQuery<
      ConcreteRequest,
      CompanyDetailViewQuery
    >;
  
    try {
      preloadedQuery = await loadSerializableQuery<
        typeof CompanyDetailViewQueryNode,
        CompanyDetailViewQuery
      >(CompanyDetailViewQueryNode.params, {
        companyId: decodeURIComponent(companyId),
      });
    } catch(error) {
      console.log("error: ", error)
      // gracefully handle errors
      notFound();
    }
  
    if (
      !preloadedQuery.response.data.node ||
      preloadedQuery.response.data.node.__typename !== "Company"
    ) {
      notFound();
    }
  
    return <CompanyDetailViewClientComponent preloadedQuery={preloadedQuery} />;
  }
  
  export const revalidate = 0;
  