---
description: Emphasizes how data fetching must take place
globs: **/*.ts, **/*.tsx
alwaysApply: false
---
- Make use of the Relay GraphQL client for data fetching, including generated typescript types wherever possible.
- Define a top level query for each page.
- Let the children components define their own fragments for data fetching, spreading those fragments in the top level query
- The GraphQL API mostly returns unions on fields. Query for the `__typename` field as well and switch between the response types.
- Use type narrowing inside components when a certain type for a field is expected to be present, using tiny-invariant.
- Re-run the relay compiler after changing queries/ fragments.
- Ensure that the fragments, queries and mutation names follow Relay's conventions (with respect to the file names).

For React Server Components (RSCs):
- Define a top level query at the page level. Include a separate fragment if needed for metadata generation.
  Mark the fragment as inline so that it can be read server side.
- Use inline fragments for any data that must be read server side.
- Make use of the `loadSerializableQuery` function to load queries (wrapped with the React cache function).
- Make the corresponding children components define their fragments and spread them in the top level query.
  Load the queries client side by using the `useSerializablePreloadedQuery` hook.
- Throw not found exceptions at the page level if required, making use of the inline fragments to check conditional logic.
  Example:
  ```tsx
    import { notFound } from "next/navigation";
    import { cache } from "react";
    import { graphql, readInlineData } from "relay-runtime";
    import type { pageOrganizationDetailMetadataFragment$key } from "@/__generated__/pageOrganizationDetailMetadataFragment.graphql";
    import type OrganizationDetailViewQueryNode from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
    import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
    import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
    import OrganizationDetailViewClientComponent from "./OrganizationDetailViewClientComponent";

    export const PageOrganizationDetailViewQuery = graphql`
    query pageOrganizationDetailViewQuery($slug: String!) {
        ...pageOrganizationDetailMetadataFragment @arguments(slug: $slug)
        ...OrganizationDetailViewClientComponentFragment @arguments(slug: $slug)
    }
    `;

    const PageOrganizationDetailMetadataFragment = graphql`
    fragment pageOrganizationDetailMetadataFragment on Query @inline @argumentDefinitions(
        slug: {
            type: "String!",
        }
        ) {
        organization(slug: $slug) {
        __typename
        ... on Organization {
            name
            description
            logoUrl
        }

        }
    }
    `;

    // Function to load and cache the query result
    const loadOrganization = cache(async (slug: string) => {
        return await loadSerializableQuery<
            typeof OrganizationDetailViewQueryNode,
            pageOrganizationDetailViewQuery
        >(PageOrganizationDetailViewQuery, {
            slug: slug,
        });
    });

    export async function generateMetadata({
        params,
    }: {
        params: Promise<{ slug: string }>;
    }) {
        const slug = (await params).slug;
        const preloadedQuery = await loadOrganization(slug);

        const data = readInlineData<pageOrganizationDetailMetadataFragment$key>(
            PageOrganizationDetailMetadataFragment,
            preloadedQuery.data,
        );

        if (data.organization.__typename !== "Organization") {
            return {
                title: "Organization Not found",
                description: "The organization you are looking for does not exist",
                openGraph: {
                    images: ["/default-image.img"],
                },
            };
        }

        return {
            title: data.organization.name,
            description: data.organization.description,
            openGraph: {
                images: [data.organization.logoUrl || "/default-image.img"],
            },
        };
    }

    export default async function OrganizationDetailPage({
        params,
    }: {
        params: Promise<{ slug: string }>;
    }) {
        const slug = (await params).slug;

        const preloadedQuery = await loadOrganization(slug);

        const data = readInlineData<pageOrganizationDetailMetadataFragment$key>(
            PageOrganizationDetailMetadataFragment,
            preloadedQuery.data,
        );

        if (data.organization.__typename !== "Organization") {
            notFound();
        }

        return (
            <OrganizationDetailViewClientComponent preloadedQuery={preloadedQuery} />
        );
    }
    ```
    ```tsx
        "use client";

    import {
        graphql,
        useFragment,
        usePreloadedQuery,
        useRelayEnvironment,
    } from "react-relay";
    import type { OrganizationDetailViewClientComponentFragment$key } from "@/__generated__/OrganizationDetailViewClientComponentFragment.graphql";
    import type OrganizationDetailViewQueryNode from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
    import type { pageOrganizationDetailViewQuery } from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
    import PageOrganizationDetailViewQuery from "@/__generated__/pageOrganizationDetailViewQuery.graphql";
    import OrganizationOverviewTab from "@/components/organization-detail/overview-tab/OrganizationOverviewTab";
    import type { SerializablePreloadedQuery } from "@/lib/relay/serializablePreloadedQuery";
    import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";

    const OrganizationDetailViewClientComponentFragment = graphql`
    fragment OrganizationDetailViewClientComponentFragment on Query @argumentDefinitions(
        slug: {
            type: "String!",
        }
        ) {
            ...ApplicationFragment @arguments(slug: $slug)
    }
    `;

    export default function OrganizationDetailViewClientComponent(props: {
        preloadedQuery: SerializablePreloadedQuery<
            typeof OrganizationDetailViewQueryNode,
            pageOrganizationDetailViewQuery
        >;
    }) {
        const environment = useRelayEnvironment();
        const queryRef = useSerializablePreloadedQuery<
            typeof OrganizationDetailViewQueryNode,
            pageOrganizationDetailViewQuery
        >(environment, props.preloadedQuery);

        const data = usePreloadedQuery(PageOrganizationDetailViewQuery, queryRef);

        const rootQuery =
            useFragment<OrganizationDetailViewClientComponentFragment$key>(
                OrganizationDetailViewClientComponentFragment,
                data,
            );

        return (
            // react component which uses fragment `ApplicationFragment` goes here
        );
    }
    ```

For Client Components:
- Ensure you use loadQuery and usePreloadedQuery APIs wherever possible, avoiding useLazyLoadQuery unless it is strictly needed
- Utilize relay client's caching capabilities wherever possible (set fetchPolicy: "store-or-network")
- Wrap components that take in the queryReference (returned by loadQuery) with Suspense to avoid runtime errors.
  Example:

  ```tsx
    export default function HeaderClientComponent() {
        const environment = useRelayEnvironment();
        const queryReference = loadQuery<HeaderQueryType>(
            environment,
            HeaderQuery,
            {},
            { fetchPolicy: "store-or-network" },
        );

        return (
            <Suspense fallback={<HeaderSkeleton />}>
                <Header queryReference={queryReference} />
            </Suspense>
        );
    }
    ```
