/**
 * @generated SignedSource<<4fec86c2224dfbbf2ee6ae2c57025d00>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type DeletePasskeyModalMutation$variables = {
  connections: ReadonlyArray<string>;
  webAuthnCredentialId: string;
};
export type DeletePasskeyModalMutation$data = {
  readonly deleteWebAuthnCredential: {
    readonly __typename: "DeleteWebAuthnCredentialSuccess";
    readonly webAuthnCredentialEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  } | {
    readonly __typename: "InsufficientAuthProvidersError";
    readonly message: string;
  } | {
    readonly __typename: "WebAuthnCredentialNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type DeletePasskeyModalMutation = {
  response: DeletePasskeyModalMutation$data;
  variables: DeletePasskeyModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "webAuthnCredentialId"
},
v2 = [
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
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "WebAuthnCredentialNotFoundError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InsufficientAuthProvidersError",
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
    "name": "DeletePasskeyModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteWebAuthnCredential",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WebAuthnCredentialEdge",
                "kind": "LinkedField",
                "name": "webAuthnCredentialEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WebAuthnCredential",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "DeleteWebAuthnCredentialSuccess",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
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
    "name": "DeletePasskeyModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteWebAuthnCredential",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WebAuthnCredentialEdge",
                "kind": "LinkedField",
                "name": "webAuthnCredentialEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WebAuthnCredential",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "filters": null,
                        "handle": "deleteEdge",
                        "key": "",
                        "kind": "ScalarHandle",
                        "name": "id",
                        "handleArgs": [
                          {
                            "kind": "Variable",
                            "name": "connections",
                            "variableName": "connections"
                          }
                        ]
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "DeleteWebAuthnCredentialSuccess",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f1fdc8f6f7c7d63b328ee74aa4850baf",
    "id": null,
    "metadata": {},
    "name": "DeletePasskeyModalMutation",
    "operationKind": "mutation",
    "text": "mutation DeletePasskeyModalMutation($webAuthnCredentialId:ID!){deleteWebAuthnCredential(webAuthnCredentialId:$webAuthnCredentialId){__typename,...on DeleteWebAuthnCredentialSuccess{webAuthnCredentialEdge{node{id}}},...on WebAuthnCredentialNotFoundError{message},...on InsufficientAuthProvidersError{message}}}"
  }
};
})();

(node as any).hash = "9ab83f8b4b40db7b6dbd35ba5d1c0f58";

export default node;
