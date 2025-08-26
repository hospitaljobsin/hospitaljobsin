/**
 * @generated SignedSource<<e201fdf3c9daf1999677822776632392>>
 * @relayHash e9480e1677350f40e2122570d8268373
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e9480e1677350f40e2122570d8268373

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type JobEditFormMutation$variables = {
  applicantLocations: ReadonlyArray<string>;
  description: string;
  expiresAt?: any | null | undefined;
  isSalaryNegotiable: boolean;
  jobId: string;
  jobType?: JobType | null | undefined;
  location: string;
  maxExperience?: number | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  skills: ReadonlyArray<string>;
  title: string;
  vacancies?: number | null | undefined;
  workMode?: WorkMode | null | undefined;
};
export type JobEditFormMutation$data = {
  readonly updateJob: {
    readonly __typename: "InvalidApplicantLocationsError";
    readonly __typename: "InvalidApplicantLocationsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidLocationError";
    readonly __typename: "InvalidLocationError";
    readonly message: string;
  } | {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "UpdateJobSuccess";
    readonly __typename: "UpdateJobSuccess";
    readonly job: {
      readonly applicantLocations: ReadonlyArray<string>;
      readonly description: string;
      readonly expiresAt: any | null | undefined;
      readonly id: string;
      readonly isActive: boolean;
      readonly isSalaryNegotiable: boolean;
      readonly location: string;
      readonly maxExperience: number | null | undefined;
      readonly maxSalary: number | null | undefined;
      readonly minExperience: number | null | undefined;
      readonly minSalary: number | null | undefined;
      readonly skills: ReadonlyArray<string>;
      readonly slug: string;
      readonly title: string;
      readonly type: JobType | null | undefined;
      readonly vacancies: number | null | undefined;
      readonly workMode: WorkMode | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment" | "JobEditFormFragment" | "JobFragment" | "JobTabsFragment">;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type JobEditFormMutation = {
  response: JobEditFormMutation$data;
  variables: JobEditFormMutation$variables;
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
  "name": "jobId"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxExperience"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
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
    "name": "jobId",
    "variableName": "jobId"
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
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minExperience",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxExperience",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minSalary",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxSalary",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalaryNegotiable",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "vacancies",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "skills",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workMode",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiresAt",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isActive",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "applicantLocations",
  "storageKey": null
},
v34 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v35 = {
  "kind": "InlineFragment",
  "selections": (v34/*: any*/),
  "type": "InvalidLocationError",
  "abstractKey": null
},
v36 = {
  "kind": "InlineFragment",
  "selections": (v34/*: any*/),
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
    "name": "JobEditFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v15/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJob",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Job",
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  (v28/*: any*/),
                  (v29/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobTabsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobControlsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobEditFormFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "UpdateJobSuccess",
            "abstractKey": null
          },
          (v35/*: any*/),
          (v36/*: any*/)
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
      (v12/*: any*/),
      (v1/*: any*/),
      (v11/*: any*/),
      (v6/*: any*/),
      (v4/*: any*/),
      (v10/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v7/*: any*/),
      (v2/*: any*/),
      (v14/*: any*/),
      (v5/*: any*/),
      (v13/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "JobEditFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v15/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJob",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Job",
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  (v28/*: any*/),
                  (v29/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
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
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "fieldName",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isRequired",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v17/*: any*/)
                    ],
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
                    "name": "currency",
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
            "type": "UpdateJobSuccess",
            "abstractKey": null
          },
          (v35/*: any*/),
          (v36/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e9480e1677350f40e2122570d8268373",
    "metadata": {},
    "name": "JobEditFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "1adef3472c25987f99249ae3fc23043c";

export default node;
