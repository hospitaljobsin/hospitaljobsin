/**
 * @generated SignedSource<<a87bb48557ffe0cd7c283d421575890b>>
 * @relayHash d891b6880e620842050601ac822aaf7b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d891b6880e620842050601ac822aaf7b

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
export type UpdatePersonalDetailsFormMutation$variables = {
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
  "name": "category"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dateOfBirth"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "gender"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maritalStatus"
},
v4 = [
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
v5 = {
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
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdatePersonalDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
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
      (v2/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdatePersonalDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
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
                  (v5/*: any*/)
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
              (v5/*: any*/)
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
    "id": "d891b6880e620842050601ac822aaf7b",
    "metadata": {},
    "name": "UpdatePersonalDetailsFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d80e1adf0da3a99d2c28e52a3ae3d285";

export default node;
