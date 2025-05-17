/**
 * @generated SignedSource<<ea95d5af6d11ff42e610492f9365048b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdatePasskeyModalMutation$variables = {
  nickname: string;
  webAuthnCredentialId: string;
};
export type UpdatePasskeyModalMutation$data = {
  readonly updateWebAuthnCredential: {
    readonly __typename: "WebAuthnCredential";
    readonly id: string;
    readonly nickname: string;
  } | {
    readonly __typename: "WebAuthnCredentialNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type UpdatePasskeyModalMutation = {
  response: UpdatePasskeyModalMutation$data;
  variables: UpdatePasskeyModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "nickname"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "webAuthnCredentialId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "nickname",
    "variableName": "nickname"
  },
  {
    "kind": "Variable",
    "name": "webAuthnCredentialId",
    "variableName": "webAuthnCredentialId"
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
  "name": "id",
  "storageKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "nickname",
      "storageKey": null
    }
  ],
  "type": "WebAuthnCredential",
  "abstractKey": null
},
v6 = {
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
  "type": "WebAuthnCredentialNotFoundError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdatePasskeyModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateWebAuthnCredential",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
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
    "name": "UpdatePasskeyModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateWebAuthnCredential",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/)
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
    "cacheID": "8e98574a73cfd8b7610c53897f943a94",
    "id": null,
    "metadata": {},
    "name": "UpdatePasskeyModalMutation",
    "operationKind": "mutation",
    "text": "mutation UpdatePasskeyModalMutation(\n  $webAuthnCredentialId: ID!\n  $nickname: String!\n) {\n  updateWebAuthnCredential(webAuthnCredentialId: $webAuthnCredentialId, nickname: $nickname) {\n    __typename\n    ... on WebAuthnCredential {\n      id\n      nickname\n    }\n    ... on WebAuthnCredentialNotFoundError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a5e86ec7844e6ca68d8983323bd6fd6b";

export default node;
