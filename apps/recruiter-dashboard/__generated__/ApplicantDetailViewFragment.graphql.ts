/**
 * @generated SignedSource<<234481145b0cb5eb73d115c7f15ad2cb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantDetailViewFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly job: {
      readonly __typename: "Job";
      readonly jobApplicant: {
        readonly __typename: "JobApplicant";
        readonly " $fragmentSpreads": FragmentRefs<"ApplicantChatFragment" | "ApplicantDetailsFragment" | "ProfileSnapshotViewFragment">;
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      };
      readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetails_job">;
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
  readonly " $fragmentType": "ApplicantDetailViewFragment";
};
export type ApplicantDetailViewFragment$key = {
  readonly " $data"?: ApplicantDetailViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailViewFragment">;
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
      "name": "applicantSlug"
    },
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
  "name": "ApplicantDetailViewFragment",
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
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "ApplicantDetails_job"
                    },
                    {
                      "alias": null,
                      "args": [
                        {
                          "kind": "Variable",
                          "name": "slug",
                          "variableName": "applicantSlug"
                        }
                      ],
                      "concreteType": null,
                      "kind": "LinkedField",
                      "name": "jobApplicant",
                      "plural": false,
                      "selections": [
                        (v0/*: any*/),
                        {
                          "kind": "InlineFragment",
                          "selections": [
                            {
                              "args": null,
                              "kind": "FragmentSpread",
                              "name": "ApplicantDetailsFragment"
                            },
                            {
                              "args": null,
                              "kind": "FragmentSpread",
                              "name": "ApplicantChatFragment"
                            },
                            {
                              "args": null,
                              "kind": "FragmentSpread",
                              "name": "ProfileSnapshotViewFragment"
                            }
                          ],
                          "type": "JobApplicant",
                          "abstractKey": null
                        }
                      ],
                      "storageKey": null
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

(node as any).hash = "f9ce4609656f433b97ccf416360e7ecc";

export default node;
