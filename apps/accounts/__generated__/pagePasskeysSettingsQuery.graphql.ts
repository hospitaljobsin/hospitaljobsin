/**
 * @generated SignedSource<<5364879df554ecff876e0c5a35c0f429>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
    "cacheID": "842072cd591289470663ad21651baad5",
    "id": null,
    "metadata": {},
    "name": "pagePasskeysSettingsQuery",
    "operationKind": "query",
    "text": "query pagePasskeysSettingsQuery{...PasskeysClientComponentFragment}fragment DeletePasskeyModalFragment on WebAuthnCredential{id}fragment PasskeyAccountMetadataFragment on Account{sudoModeExpiresAt,authProviders}fragment PasskeyFragment on WebAuthnCredential{id,nickname,createdAt,lastUsedAt,...UpdatePasskeyModalFragment,...DeletePasskeyModalFragment}fragment PasskeysClientComponentFragment on Query{...PasskeysSettingsViewFragment}fragment PasskeysControllerFragment on Account{sudoModeExpiresAt}fragment PasskeysListFragment on Account{...PasskeyAccountMetadataFragment,...PasskeysListInternalFragment,...PasskeysControllerFragment}fragment PasskeysListInternalFragment on Account{webAuthnCredentials(first:10){edges{node{id,...PasskeyFragment,__typename},cursor},pageInfo{hasNextPage,endCursor}},id}fragment PasskeysSettingsViewFragment on Query{viewer{__typename,...on Account{...PasskeysListFragment},...on Node{__isNode:__typename,id}}}fragment UpdatePasskeyModalFragment on WebAuthnCredential{id,nickname}"
  }
};
})();

(node as any).hash = "1afa6cd22ceedd2252df7487328b9a9f";

export default node;
