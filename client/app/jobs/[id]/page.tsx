import JobDetailViewQueryNode, {
  JobDetailViewQuery,
} from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import JobDetailViewClientComponent from "./JobDetailViewClientComponent";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const jobId = (await params).id;
  const preloadedQuery = await loadSerializableQuery<
    typeof JobDetailViewQueryNode,
    JobDetailViewQuery
  >(JobDetailViewQueryNode.params, {
    jobId: decodeURIComponent(jobId),
  });

  return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}

export const revalidate = 0;
