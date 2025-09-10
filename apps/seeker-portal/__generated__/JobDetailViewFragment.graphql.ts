/**
 * @generated SignedSource<<918baf440893f2ea6ceb9f17c31b0ad9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobDetailViewFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly job: {
      readonly __typename: "Job";
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"RelatedJobsListFragment">;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment" | "TrendingJobListFragment">;
  readonly " $fragmentType": "JobDetailViewFragment";
};
export type JobDetailViewFragment$key = {
  readonly " $data"?: JobDetailViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "jobSlug"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobDetailViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TrendingJobListFragment"
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "jobSlug",
          "variableName": "jobSlug"
        },
        (v0/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "JobDetailsFragment"
    },
    {
      "alias": null,
      "args": [
        (v0/*: any*/)
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "organization",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": [
                {
                  "kind": "Variable",
                  "name": "slug",
                  "variableName": "jobSlug"
                }
              ],
              "concreteType": null,
              "kind": "LinkedField",
              "name": "job",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "id",
                      "storageKey": null
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "RelatedJobsListFragment"
                    }
                  ],
                  "type": "Job",
                  "abstractKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "type": "Organization",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "dba668626a29d0e392af6f7c80a18e6a";

export default node;
