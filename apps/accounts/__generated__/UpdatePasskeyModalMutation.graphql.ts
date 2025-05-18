/**
 * @generated SignedSource<<5df70b84a254af0425b556c28d974c4c>>
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
    "cacheID": "e99c4f7cfb617a6cae11eed76e958247",
    "id": null,
    "metadata": {},
    "name": "UpdatePasskeyModalMutation",
    "operationKind": "mutation",
    "text": "mutation UpdatePasskeyModalMutation($webAuthnCredentialId:ID!,$nickname:String!){updateWebAuthnCredential(webAuthnCredentialId:$webAuthnCredentialId,nickname:$nickname){__typename,...on WebAuthnCredential{id,nickname},...on WebAuthnCredentialNotFoundError{message},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "a5e86ec7844e6ca68d8983323bd6fd6b";

export default node;
