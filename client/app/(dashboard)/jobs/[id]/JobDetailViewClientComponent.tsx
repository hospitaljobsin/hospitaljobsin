"use client";

import JobDetailView from "@/components/job-detail/JobDetailView";
import { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import { useRelayEnvironment } from "react-relay";

import JobDetailViewQueryNode, {
  JobDetailViewQuery,
} from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";

export default function JobDetailViewClientComponent(props: {
  preloadedQuery: SerializablePreloadedQuery<
    typeof JobDetailViewQueryNode,
    JobDetailViewQuery
  >;
}) {
  const environment = useRelayEnvironment();
  const queryRef = useSerializablePreloadedQuery(
    environment,
    props.preloadedQuery
  );

  return <JobDetailView queryRef={queryRef} />;
}
