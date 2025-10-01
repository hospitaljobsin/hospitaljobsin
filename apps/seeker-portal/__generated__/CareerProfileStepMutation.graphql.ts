/**
 * @generated SignedSource<<873d1e20be4afa11a69dcddb1a4c20c7>>
 * @relayHash e8f04395f97850cb4808e4e885dc10e8
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e8f04395f97850cb4808e4e885dc10e8

import type { ConcreteRequest } from 'relay-runtime';
export type CareerProfileStepMutation$variables = {
  locationsOpenToWork: ReadonlyArray<string>;
  openToRelocationAnywhere: boolean;
};
export type CareerProfileStepMutation$data = {
  readonly updateProfileCareerProfile: {
    readonly profile?: {
      readonly careerProfile: {
        readonly locationsOpenToWork: ReadonlyArray<string>;
        readonly openToRelocationAnywhere: boolean;
      } | null | undefined;
    } | null | undefined;
  };
};
export type CareerProfileStepMutation = {
  response: CareerProfileStepMutation$data;
  variables: CareerProfileStepMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
    "kind": "Literal",
    "name": "desiredJobTypes",
    "value": ([]/*: any*/)
  },
  {
    "kind": "Literal",
    "name": "desiredWorkModes",
    "value": ([]/*: any*/)
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
  "concreteType": "CareerProfile",
  "kind": "LinkedField",
  "name": "careerProfile",
  "plural": false,
  "selections": [
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
    "name": "CareerProfileStepMutation",
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
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
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
    "name": "CareerProfileStepMutation",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/)
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
    "id": "e8f04395f97850cb4808e4e885dc10e8",
    "metadata": {},
    "name": "CareerProfileStepMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "26908e02e6bbb032dde2e9df04226464";

export default node;
