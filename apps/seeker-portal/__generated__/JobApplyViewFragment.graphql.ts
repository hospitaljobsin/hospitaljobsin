/**
 * @generated SignedSource<<111beb55e6d36c2a54e8409919eba25b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplyViewFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly job: {
      readonly __typename: "Job";
      readonly applicationForm: {
        readonly fields: ReadonlyArray<{
          readonly __typename: "ApplicationField";
        }>;
      } | null | undefined;
      readonly externalApplicationUrl: string | null | undefined;
      readonly id: string;
      readonly isApplied: boolean;
      readonly isVisible: boolean;
      readonly slug: string;
      readonly " $fragmentSpreads": FragmentRefs<"CompleteProfileDrawerJobFragment" | "JobApplicationDetailsFragment" | "JobApplyFormFragment" | "JobDetailsInternalFragment">;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly slug: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly viewer: {
    readonly __typename: "Account";
    readonly profile: {
      readonly isComplete: boolean;
    };
    readonly " $fragmentSpreads": FragmentRefs<"CompleteProfileDrawerFragment" | "ProfileReviewFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "JobApplyViewFragment";
};
export type JobApplyViewFragment$key = {
  readonly " $data"?: JobApplyViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplyViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
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
  "name": "JobApplyViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    },
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
            (v1/*: any*/),
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
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isApplied",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "externalApplicationUrl",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "isVisible",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "JobApplicationForm",
                      "kind": "LinkedField",
                      "name": "applicationForm",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "ApplicationField",
                          "kind": "LinkedField",
                          "name": "fields",
                          "plural": true,
                          "selections": [
                            (v0/*: any*/)
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "JobApplyFormFragment"
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "JobApplicationDetailsFragment"
                    },
                    {
                      "kind": "InlineDataFragmentSpread",
                      "name": "JobDetailsInternalFragment",
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "title",
                          "storageKey": null
                        },
                        (v1/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "description",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "descriptionHtml",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "type",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "workMode",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "location",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "skills",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "currency",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "minSalary",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "maxSalary",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "minExperience",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "maxExperience",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "createdAt",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "vacancies",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "isSalaryNegotiable",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Organization",
                          "kind": "LinkedField",
                          "name": "organization",
                          "plural": false,
                          "selections": [
                            (v1/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "name",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "descriptionCleaned",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "logoUrl",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": null,
                              "kind": "LinkedField",
                              "name": "verificationStatus",
                              "plural": false,
                              "selections": [
                                (v0/*: any*/),
                                {
                                  "fragment": {
                                    "kind": "InlineFragment",
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "verifiedAt",
                                        "storageKey": null
                                      }
                                    ],
                                    "type": "Verified",
                                    "abstractKey": null
                                  },
                                  "kind": "AliasedInlineFragmentSpread",
                                  "name": "verified"
                                },
                                {
                                  "kind": "InlineFragment",
                                  "selections": [
                                    {
                                      "alias": null,
                                      "args": null,
                                      "kind": "ScalarField",
                                      "name": "rejectedAt",
                                      "storageKey": null
                                    }
                                  ],
                                  "type": "Rejected",
                                  "abstractKey": null
                                },
                                {
                                  "kind": "InlineFragment",
                                  "selections": [
                                    {
                                      "alias": null,
                                      "args": null,
                                      "kind": "ScalarField",
                                      "name": "requestedAt",
                                      "storageKey": null
                                    }
                                  ],
                                  "type": "Pending",
                                  "abstractKey": null
                                },
                                {
                                  "kind": "InlineFragment",
                                  "selections": [
                                    {
                                      "alias": null,
                                      "args": null,
                                      "kind": "ScalarField",
                                      "name": "message",
                                      "storageKey": null
                                    }
                                  ],
                                  "type": "NotRequested",
                                  "abstractKey": null
                                }
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "args": null,
                      "argumentDefinitions": []
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "CompleteProfileDrawerJobFragment"
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "ProfileReviewFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "CompleteProfileDrawerFragment"
            },
            {
              "kind": "RequiredField",
              "field": {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isComplete",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              "action": "THROW"
            }
          ],
          "type": "Account",
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

(node as any).hash = "f8f94959bc44cfcc8de3ba3bea14c183";

export default node;
