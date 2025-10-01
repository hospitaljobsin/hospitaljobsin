/**
 * @generated SignedSource<<424753174cb56c5126bb69e0c8125ef5>>
 * @relayHash e94e89dbf8bc0e02dc2818c3fbbd8494
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e94e89dbf8bc0e02dc2818c3fbbd8494

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type UpdateCareerProfileFormMutation$variables = {
  currentIndustry?: string | null | undefined;
  desiredJobTypes: ReadonlyArray<JobType>;
  desiredWorkModes: ReadonlyArray<WorkMode>;
  expectedSalary?: number | null | undefined;
  locationsOpenToWork: ReadonlyArray<string>;
  openToRelocationAnywhere: boolean;
};
export type UpdateCareerProfileFormMutation$data = {
  readonly updateProfileCareerProfile: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateCareerProfileFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ResumeProgressAccountFragment">;
  };
};
export type UpdateCareerProfileFormMutation = {
  response: UpdateCareerProfileFormMutation$data;
  variables: UpdateCareerProfileFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "currentIndustry"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "desiredJobTypes"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "desiredWorkModes"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "expectedSalary"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationsOpenToWork"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "openToRelocationAnywhere"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "currentIndustry",
    "variableName": "currentIndustry"
  },
  {
    "kind": "Variable",
    "name": "desiredJobTypes",
    "variableName": "desiredJobTypes"
  },
  {
    "kind": "Variable",
    "name": "desiredWorkModes",
    "variableName": "desiredWorkModes"
  },
  {
    "kind": "Variable",
    "name": "expectedSalary",
    "variableName": "expectedSalary"
  },
  {
    "kind": "Variable",
    "name": "locationsOpenToWork",
    "variableName": "locationsOpenToWork"
  },
  {
    "kind": "Variable",
    "name": "openToRelocationAnywhere",
    "variableName": "openToRelocationAnywhere"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateCareerProfileFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileCareerProfile",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ResumeProgressAccountFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateCareerProfileFormFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateCareerProfileFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileCareerProfile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "phoneNumber",
                "storageKey": null
              },
              {
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
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updatedAt",
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CareerProfile",
                    "kind": "LinkedField",
                    "name": "careerProfile",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "currentIndustry",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "desiredJobTypes",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "desiredWorkModes",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expectedSalary",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "locationsOpenToWork",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "openToRelocationAnywhere",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e94e89dbf8bc0e02dc2818c3fbbd8494",
    "metadata": {},
    "name": "UpdateCareerProfileFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "1f1f1319ff4c1a61cc13ed1e8c78b0c0";

export default node;
