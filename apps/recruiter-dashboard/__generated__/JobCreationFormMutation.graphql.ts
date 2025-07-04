/**
 * @generated SignedSource<<bae690f94a96653a8192499b329ab977>>
 * @relayHash 5ccfcdaae8bc0e2037cfd3a6db91025d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 5ccfcdaae8bc0e2037cfd3a6db91025d

import type { ConcreteRequest } from 'relay-runtime';
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type JobCreationFormMutation$variables = {
  description: string;
  expiresAt?: any | null | undefined;
  isSalaryNegotiable: boolean;
  jobType?: JobType | null | undefined;
  location?: string | null | undefined;
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
        readonly slug: string;
      };
    };
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
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "expiresAt"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "isSalaryNegotiable"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxExperience"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "skills"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "vacancies"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v14 = [
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
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
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
      (v13/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "JobCreationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v14/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJob",
        "plural": false,
        "selections": [
          (v15/*: any*/),
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
                      (v16/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "CreateJobSuccess",
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
      (v9/*: any*/),
      (v11/*: any*/),
      (v0/*: any*/),
      (v10/*: any*/),
      (v4/*: any*/),
      (v8/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v13/*: any*/),
      (v12/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "JobCreationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v14/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJob",
        "plural": false,
        "selections": [
          (v15/*: any*/),
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
                      (v16/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "id",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "5ccfcdaae8bc0e2037cfd3a6db91025d",
    "metadata": {},
    "name": "JobCreationFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "ce52e4c8b318c2323c1f436357e86868";

export default node;
