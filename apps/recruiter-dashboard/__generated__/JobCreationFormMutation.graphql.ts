/**
 * @generated SignedSource<<ef28e277ec4905e6b6d3c5b7ac52b46d>>
 * @relayHash e837f2f17a8525a78459d759bcd1447f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e837f2f17a8525a78459d759bcd1447f

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type JobCreationFormMutation$variables = {
  applicantLocations: ReadonlyArray<string>;
  description: string;
  expiresAt?: any | null | undefined;
  isSalaryNegotiable: boolean;
  jobType?: JobType | null | undefined;
  location: string;
  maxExperience?: number | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  organizationId: string;
  skills: ReadonlyArray<string>;
  title: string;
  vacancies?: number | null | undefined;
  workMode?: WorkMode | null | undefined;
};
export type JobCreationFormMutation$data = {
  readonly createJob: {
    readonly __typename: "CreateJobSuccess";
    readonly jobEdge: {
      readonly node: {
        readonly id: string;
        readonly slug: string;
        readonly " $fragmentSpreads": FragmentRefs<"JobFragment">;
      };
    };
  } | {
    readonly __typename: "InvalidApplicantLocationsError";
    readonly __typename: "InvalidApplicantLocationsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidLocationError";
    readonly __typename: "InvalidLocationError";
    readonly message: string;
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type JobCreationFormMutation = {
  response: JobCreationFormMutation$data;
  variables: JobCreationFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "applicantLocations"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "expiresAt"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isSalaryNegotiable"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxExperience"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "skills"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "vacancies"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v15 = [
  {
    "kind": "Variable",
    "name": "applicantLocations",
    "variableName": "applicantLocations"
  },
  {
    "kind": "Variable",
    "name": "description",
    "variableName": "description"
  },
  {
    "kind": "Variable",
    "name": "expiresAt",
    "variableName": "expiresAt"
  },
  {
    "kind": "Variable",
    "name": "isSalaryNegotiable",
    "variableName": "isSalaryNegotiable"
  },
  {
    "kind": "Variable",
    "name": "jobType",
    "variableName": "jobType"
  },
  {
    "kind": "Variable",
    "name": "location",
    "variableName": "location"
  },
  {
    "kind": "Variable",
    "name": "maxExperience",
    "variableName": "maxExperience"
  },
  {
    "kind": "Variable",
    "name": "maxSalary",
    "variableName": "maxSalary"
  },
  {
    "kind": "Variable",
    "name": "minExperience",
    "variableName": "minExperience"
  },
  {
    "kind": "Variable",
    "name": "minSalary",
    "variableName": "minSalary"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  },
  {
    "kind": "Variable",
    "name": "skills",
    "variableName": "skills"
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  },
  {
    "kind": "Variable",
    "name": "vacancies",
    "variableName": "vacancies"
  },
  {
    "kind": "Variable",
    "name": "workMode",
    "variableName": "workMode"
  }
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v19 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v20 = {
  "kind": "InlineFragment",
  "selections": (v19/*: any*/),
  "type": "InvalidLocationError",
  "abstractKey": null
},
v21 = {
  "kind": "InlineFragment",
  "selections": (v19/*: any*/),
  "type": "InvalidApplicantLocationsError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
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
      (v14/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "JobCreationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v15/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJob",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "JobEdge",
                "kind": "LinkedField",
                "name": "jobEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      (v18/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "JobFragment"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "CreateJobSuccess",
            "abstractKey": null
          },
          (v20/*: any*/),
          (v21/*: any*/)
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
      (v10/*: any*/),
      (v12/*: any*/),
      (v1/*: any*/),
      (v11/*: any*/),
      (v5/*: any*/),
      (v0/*: any*/),
      (v9/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v6/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/),
      (v14/*: any*/),
      (v13/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "JobCreationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v15/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJob",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "JobEdge",
                "kind": "LinkedField",
                "name": "jobEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      (v18/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
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
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "viewCount",
                        "plural": false,
                        "selections": [
                          (v16/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "count",
                                "storageKey": null
                              }
                            ],
                            "type": "JobViewCountSuccess",
                            "abstractKey": null
                          }
                        ],
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
                        "name": "isActive",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expiresAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "applicantCount",
                        "plural": false,
                        "selections": [
                          (v16/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "applied",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "shortlisted",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "interviewed",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "onHold",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "offered",
                                "storageKey": null
                              }
                            ],
                            "type": "JobApplicantCount",
                            "abstractKey": null
                          }
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
            "type": "CreateJobSuccess",
            "abstractKey": null
          },
          (v20/*: any*/),
          (v21/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e837f2f17a8525a78459d759bcd1447f",
    "metadata": {},
    "name": "JobCreationFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "6f36f3660da7d9ef2c62b406d3caa1df";

export default node;
