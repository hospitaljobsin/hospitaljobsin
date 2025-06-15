/**
 * @generated SignedSource<<6458d74fb27f59dfdf05f65907d1ec3f>>
 * @relayHash 97ef96c46746c45290e9df9d8843ac5e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 97ef96c46746c45290e9df9d8843ac5e

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
export type UpdatePersonalDetailsFormMutation$variables = {
  address: string;
  category?: string | null | undefined;
  dateOfBirth?: any | null | undefined;
  gender?: GenderType | null | undefined;
  maritalStatus?: MaritalStatusType | null | undefined;
};
export type UpdatePersonalDetailsFormMutation$data = {
  readonly updateProfilePersonalDetails: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdatePersonalDetailsFormFragment">;
    } | null | undefined;
  };
};
export type UpdatePersonalDetailsFormMutation = {
  response: UpdatePersonalDetailsFormMutation$data;
  variables: UpdatePersonalDetailsFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "address"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "category"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dateOfBirth"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "gender"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maritalStatus"
},
v5 = [
  {
    "kind": "Variable",
    "name": "address",
    "variableName": "address"
  },
  {
    "kind": "Variable",
    "name": "category",
    "variableName": "category"
  },
  {
    "kind": "Variable",
    "name": "dateOfBirth",
    "variableName": "dateOfBirth"
  },
  {
    "kind": "Variable",
    "name": "gender",
    "variableName": "gender"
  },
  {
    "kind": "Variable",
    "name": "maritalStatus",
    "variableName": "maritalStatus"
  }
],
v6 = {
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdatePersonalDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfilePersonalDetails",
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
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdatePersonalDetailsFormFragment"
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
    "argumentDefinitions": [
      (v3/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdatePersonalDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfilePersonalDetails",
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "address",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "gender",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dateOfBirth",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "maritalStatus",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "category",
                    "storageKey": null
                  },
                  (v6/*: any*/)
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
              (v6/*: any*/)
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
    "id": "97ef96c46746c45290e9df9d8843ac5e",
    "metadata": {},
    "name": "UpdatePersonalDetailsFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "c14475c4a97e5b9bb41570c46d1c2b6e";

export default node;
