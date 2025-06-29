/**
 * @generated SignedSource<<2e1f8a3dc10a39e46ff2378770efc5ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantsTabFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isMember: boolean;
    readonly job: {
      readonly __typename: "Job";
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"ApplicantListControllerFragment" | "ApplicantListFragment">;
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
  readonly " $fragmentType": "ApplicantsTabFragment";
};
export type ApplicantsTabFragment$key = {
  readonly " $data"?: ApplicantsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantsTabFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
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
      "name": "searchTerm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    },
    {
      "defaultValue": "OVERALL_SCORE",
      "kind": "LocalArgument",
      "name": "sortBy"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "status"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantsTabFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "organization",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isMember",
              "storageKey": null
            },
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
                (v0/*: any*/),
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
                      "name": "ApplicantListControllerFragment"
                    },
                    {
                      "args": [
                        {
                          "kind": "Variable",
                          "name": "searchTerm",
                          "variableName": "searchTerm"
                        },
                        {
                          "kind": "Variable",
                          "name": "sortBy",
                          "variableName": "sortBy"
                        },
                        {
                          "kind": "Variable",
                          "name": "status",
                          "variableName": "status"
                        }
                      ],
                      "kind": "FragmentSpread",
                      "name": "ApplicantListFragment"
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

(node as any).hash = "3c7633708988e59d310d22ace5b47dc0";

export default node;
