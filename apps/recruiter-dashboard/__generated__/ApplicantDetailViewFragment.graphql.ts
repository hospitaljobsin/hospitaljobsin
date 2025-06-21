/**
 * @generated SignedSource<<fcc2751f6bf70b6ab095b5943141e029>>
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
        readonly profileSnapshot: {
          readonly " $fragmentSpreads": FragmentRefs<"ProfileSnapshotViewFragment">;
        };
        readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailsFragment">;
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
                              "alias": null,
                              "args": null,
                              "concreteType": "ProfileSnapshot",
                              "kind": "LinkedField",
                              "name": "profileSnapshot",
                              "plural": false,
                              "selections": [
                                {
                                  "args": null,
                                  "kind": "FragmentSpread",
                                  "name": "ProfileSnapshotViewFragment"
                                }
                              ],
                              "storageKey": null
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

(node as any).hash = "38a01e056d2099d117c1cbcc09179081";

export default node;
