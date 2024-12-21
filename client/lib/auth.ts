import type { AuthProviderQuery } from "@/components/__generated__/AuthProviderQuery.graphql";
import AuthProviderQueryNode from "@/components/__generated__/AuthProviderQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";

export async function loadViewer() {
	return await loadSerializableQuery<
		typeof AuthProviderQueryNode,
		AuthProviderQuery
	>(AuthProviderQueryNode.params, {});
}
