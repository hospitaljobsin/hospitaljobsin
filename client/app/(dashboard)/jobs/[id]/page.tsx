import JobDetailViewQueryNode, {
  JobDetailViewQuery,
} from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import loadSerializableQuery, {
  SerializablePreloadedQuery,
} from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { ConcreteRequest } from "relay-runtime";
import JobDetailViewClientComponent from "./JobDetailViewClientComponent";

export const dynamic = "force-dynamic"

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
  } catch(error) {
    console.log("error: ", error)
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
