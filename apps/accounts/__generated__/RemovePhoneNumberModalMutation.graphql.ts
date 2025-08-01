/**
 * @generated SignedSource<<872349a6cce6cf570d2843e78af5e7f2>>
 * @relayHash 3855f250d6d4bfffb34535910b912e73
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3855f250d6d4bfffb34535910b912e73

import type { ConcreteRequest } from 'relay-runtime';
export type RemovePhoneNumberModalMutation$variables = Record<PropertyKey, never>;
export type RemovePhoneNumberModalMutation$data = {
  readonly removeAccountPhoneNumber: {
    readonly __typename: "Account";
    readonly id: string;
    readonly phoneNumber: string | null | undefined;
  } | {
    readonly __typename: "PhoneNumberDoesNotExistError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type RemovePhoneNumberModalMutation = {
  response: RemovePhoneNumberModalMutation$data;
  variables: RemovePhoneNumberModalMutation$variables;
};

const node: ConcreteRequest = (function(){
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
  "name": "id",
  "storageKey": null
},
v2 = {
  "kind": "InlineFragment",
  "selections": [
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phoneNumber",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
},
v3 = {
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
  "type": "PhoneNumberDoesNotExistError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RemovePhoneNumberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeAccountPhoneNumber",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RemovePhoneNumberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeAccountPhoneNumber",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/)
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
    "id": "3855f250d6d4bfffb34535910b912e73",
    "metadata": {},
    "name": "RemovePhoneNumberModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "c881d71c90406df17e7b1bca158ed6b4";

export default node;
