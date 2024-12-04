import { runWithAmplifyServerContext } from "@/utils/amplify-server-utils";
import { fetchAuthSession } from "aws-amplify/auth";
import { fetchAuthSession as fetchAuthSessionServer } from "aws-amplify/auth/server";
import {
  CacheConfig,
  Environment,
  GraphQLResponse,
  Network,
  QueryResponseCache,
  RecordSource,
  RequestParameters,
  Store,
  Variables,
} from "relay-runtime";

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;
const IS_SERVER = typeof window === typeof undefined;
const CACHE_TTL = 5 * 1000; // 5 seconds, to resolve preloaded results

export async function fetchAuthSessionServerSide() {
  const { cookies } = await import("next/headers");
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        return await fetchAuthSessionServer(contextSpec);
      } catch (error) {
        console.log(error);
      }
    },
  });
}

export async function networkFetch(
  request: RequestParameters,
  variables: Variables
): Promise<GraphQLResponse> {
  let session;
  try {
    if (IS_SERVER) {
      session = await fetchAuthSessionServerSide();
    } else {
      session = await fetchAuthSession();
    }
  } catch (err) {
    console.error(err);
  }

  let token;

  if (session?.tokens) {
    token = session.tokens.accessToken.toString();
  }

  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });
  const json = await resp.json();

  // GraphQL returns exceptions (for example, a missing required variable) in the "errors"
  // property of the response. If any exceptions occurred when processing the request,
  // throw an error to indicate to the developer what went wrong.
  if (Array.isArray(json.errors)) {
    console.error(json.errors);
    throw new Error(
      `Error fetching GraphQL query '${
        request.name
      }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
  }

  return json;
}

export const responseCache: QueryResponseCache | null = IS_SERVER
  ? null
  : new QueryResponseCache({
      size: 100,
      ttl: CACHE_TTL,
    });

function createNetwork() {
  async function fetchResponse(
    params: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig
  ) {
    const isQuery = params.operationKind === "query";
    const cacheKey = params.id ?? params.cacheID;
    const forceFetch = cacheConfig && cacheConfig.force;
    if (responseCache != null && isQuery && !forceFetch) {
      const fromCache = responseCache.get(cacheKey, variables);
      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    return networkFetch(params, variables);
  }

  const network = Network.create(fetchResponse);
  return network;
}

function createEnvironment() {
  return new Environment({
    network: createNetwork(),
    store: new Store(RecordSource.create()),
    isServer: IS_SERVER,
  });
}

export const environment = createEnvironment();

export function getCurrentEnvironment() {
  if (IS_SERVER) {
    return createEnvironment();
  }

  return environment;
}
