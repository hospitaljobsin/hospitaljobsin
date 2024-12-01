import LandingViewQueryNode, {
  LandingViewQuery,
} from "@/components/landing/__generated__/LandingViewQuery.graphql";
import MainViewClientComponent from "@/components/landing/LandingViewClientComponent";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";

export default async function Home() {
  const preloadedQuery = await loadSerializableQuery<
    typeof LandingViewQueryNode,
    LandingViewQuery
  >(LandingViewQueryNode.params, {});

  return <MainViewClientComponent preloadedQuery={preloadedQuery} />;
}
