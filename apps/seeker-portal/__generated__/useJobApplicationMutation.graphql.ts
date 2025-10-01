/**
 * @generated SignedSource<<f9f60591b53a720c773235e18cb3aea1>>
 * @relayHash 007e49603898732d4545267ec65e7604
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 007e49603898732d4545267ec65e7604

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantFieldInput = {
  fieldName: string;
  fieldValue: string;
};
export type useJobApplicationMutation$variables = {
  applicantFields: ReadonlyArray<ApplicantFieldInput>;
  jobId: string;
};
export type useJobApplicationMutation$data = {
  readonly createJobApplication: {
    readonly __typename: "AccountProfileIncompleteError";
    readonly __typename: "AccountProfileIncompleteError";
  } | {
    readonly __typename: "CreateJobApplicantSuccess";
    readonly jobApplicant: {
      readonly job: {
        readonly organization: {
          readonly slug: string;
        } | null | undefined;
        readonly slug: string;
        readonly " $fragmentSpreads": FragmentRefs<"JobDetailsInternalFragment">;
      } | null | undefined;
    };
  } | {
    readonly __typename: "JobApplicantAlreadyExistsError";
    readonly __typename: "JobApplicantAlreadyExistsError";
  } | {
    readonly __typename: "JobIsExternalError";
    readonly __typename: "JobIsExternalError";
  } | {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "JobNotPublishedError";
    readonly __typename: "JobNotPublishedError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type useJobApplicationMutation = {
  response: useJobApplicationMutation$data;
  variables: useJobApplicationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "applicantFields"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "applicantFields",
    "variableName": "applicantFields"
  },
  {
    "kind": "Variable",
    "name": "jobId",
    "variableName": "jobId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "descriptionHtml",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workMode",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "skills",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minSalary",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxSalary",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minExperience",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxExperience",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "vacancies",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalaryNegotiable",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "descriptionCleaned",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v23 = {
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
v24 = {
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
v25 = {
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
v26 = {
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
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useJobApplicationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJobApplication",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicant",
                "kind": "LinkedField",
                "name": "jobApplicant",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "InlineDataFragmentSpread",
                        "name": "JobDetailsInternalFragment",
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v19/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Organization",
                            "kind": "LinkedField",
                            "name": "organization",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              (v20/*: any*/),
                              (v21/*: any*/),
                              (v22/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "verificationStatus",
                                "plural": false,
                                "selections": [
                                  (v3/*: any*/),
                                  {
                                    "fragment": (v23/*: any*/),
                                    "kind": "AliasedInlineFragmentSpread",
                                    "name": "verified"
                                  },
                                  (v24/*: any*/),
                                  (v25/*: any*/),
                                  (v26/*: any*/)
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
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Organization",
                        "kind": "LinkedField",
                        "name": "organization",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "CreateJobApplicantSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useJobApplicationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJobApplication",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicant",
                "kind": "LinkedField",
                "name": "jobApplicant",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Organization",
                        "kind": "LinkedField",
                        "name": "organization",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v20/*: any*/),
                          (v21/*: any*/),
                          (v22/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "verificationStatus",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v23/*: any*/),
                              (v24/*: any*/),
                              (v25/*: any*/),
                              (v26/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v27/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v27/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v27/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "CreateJobApplicantSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "007e49603898732d4545267ec65e7604",
    "metadata": {},
    "name": "useJobApplicationMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "e8d68f8d56610dac85872b604239d812";

export default node;
