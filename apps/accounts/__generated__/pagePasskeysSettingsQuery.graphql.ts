/**
 * @generated SignedSource<<eee76ab780e1defe30c9d400dd7a0ce5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pagePasskeysSettingsQuery$variables = Record<PropertyKey, never>;
export type pagePasskeysSettingsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PasskeysClientComponentFragment">;
};
export type pagePasskeysSettingsQuery = {
  response: pagePasskeysSettingsQuery$data;
  variables: pagePasskeysSettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pagePasskeysSettingsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PasskeysClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pagePasskeysSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sudoModeExpiresAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "authProviders",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v1/*: any*/),
                "concreteType": "WebAuthnCredentialConnection",
                "kind": "LinkedField",
                "name": "webAuthnCredentials",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WebAuthnCredentialEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "WebAuthnCredential",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "nickname",
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
                            "name": "lastUsedAt",
                            "storageKey": null
                          },
                          (v0/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ClientExtension",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__id",
                        "storageKey": null
                      }
                    ]
                  }
                ],
                "storageKey": "webAuthnCredentials(first:10)"
              },
              {
                "alias": null,
                "args": (v1/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "PasskeysListInternalFragment_webAuthnCredentials",
                "kind": "LinkedHandle",
                "name": "webAuthnCredentials"
              },
              (v2/*: any*/)
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/)
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
    "cacheID": "c7a3a9ee6c41684ed2e590a305d2028a",
    "id": null,
    "metadata": {},
    "name": "pagePasskeysSettingsQuery",
    "operationKind": "query",
    "text": "query pagePasskeysSettingsQuery {\n  ...PasskeysClientComponentFragment\n}\n\nfragment DeletePasskeyModalFragment on WebAuthnCredential {\n  id\n}\n\nfragment PasskeyAccountMetadataFragment on Account {\n  sudoModeExpiresAt\n  authProviders\n}\n\nfragment PasskeyFragment on WebAuthnCredential {\n  id\n  nickname\n  createdAt\n  lastUsedAt\n  ...UpdatePasskeyModalFragment\n  ...DeletePasskeyModalFragment\n}\n\nfragment PasskeysClientComponentFragment on Query {\n  ...PasskeysSettingsViewFragment\n}\n\nfragment PasskeysControllerFragment on Account {\n  sudoModeExpiresAt\n}\n\nfragment PasskeysListFragment on Account {\n  ...PasskeyAccountMetadataFragment\n  ...PasskeysListInternalFragment\n  ...PasskeysControllerFragment\n}\n\nfragment PasskeysListInternalFragment on Account {\n  webAuthnCredentials(first: 10) {\n    edges {\n      node {\n        id\n        ...PasskeyFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  id\n}\n\nfragment PasskeysSettingsViewFragment on Query {\n  viewer {\n    __typename\n    ... on Account {\n      ...PasskeysListFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment UpdatePasskeyModalFragment on WebAuthnCredential {\n  id\n  nickname\n}\n"
  }
};
})();

(node as any).hash = "1afa6cd22ceedd2252df7487328b9a9f";

export default node;
