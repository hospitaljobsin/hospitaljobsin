"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import { SavedViewQuery as SavedViewQueryType } from "./__generated__/SavedViewQuery.graphql";

const SavedViewQuery = graphql`
  query SavedViewQuery {
    viewer {
      __typename
      ... on Account {
        ...ProfileHeaderFragment
      }
    }
  }
`;

export default function SavedView() {
  const data = useLazyLoadQuery<SavedViewQueryType>(SavedViewQuery, {});

  if (data.viewer.__typename === "%other") {
    return null;
  }

  return (
    <>
      <h1>My Saved jobs</h1>
    </>
  );
}
