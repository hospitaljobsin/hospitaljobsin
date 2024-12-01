"use client";

import { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import { useRelayEnvironment } from "react-relay";
import LandingView from "./LandingView";
import LandingViewQueryNode, {
  LandingViewQuery,
} from "./__generated__/LandingViewQuery.graphql";

const MainViewClientComponent = (props: {
  preloadedQuery: SerializablePreloadedQuery<
    typeof LandingViewQueryNode,
    LandingViewQuery
  >;
}) => {
  const environment = useRelayEnvironment();
  const queryRef = useSerializablePreloadedQuery(
    environment,
    props.preloadedQuery
  );

  return <LandingView queryRef={queryRef} />;
};

export default MainViewClientComponent;
