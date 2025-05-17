/**
 * @generated SignedSource<<dc31807a446a88628bdbc1bae2781747>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageSessionsSettingsQuery$variables = Record<PropertyKey, never>;
export type pageSessionsSettingsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SessionsClientComponentFragment">;
};
export type pageSessionsSettingsQuery = {
  response: pageSessionsSettingsQuery$data;
  variables: pageSessionsSettingsQuery$variables;
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
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "userAgent",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ipAddress",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSessionsSettingsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "SessionsClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageSessionsSettingsQuery",
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
                "args": (v1/*: any*/),
                "concreteType": "SessionConnection",
                "kind": "LinkedField",
                "name": "sessions",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SessionEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Session",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
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
                "storageKey": "sessions(first:10)"
              },
              {
                "alias": null,
                "args": (v1/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "SessionsListInternalFragment_sessions",
                "kind": "LinkedHandle",
                "name": "sessions"
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Session",
                "kind": "LinkedField",
                "name": "currentSession",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
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
    "cacheID": "18741de813a325f89d2edd6313c21f89",
    "id": null,
    "metadata": {},
    "name": "pageSessionsSettingsQuery",
    "operationKind": "query",
    "text": "query pageSessionsSettingsQuery {\n  ...SessionsClientComponentFragment\n}\n\nfragment DeleteSessionModalFragment on Session {\n  id\n}\n\nfragment SessionAccountSudoFragment on Account {\n  sudoModeExpiresAt\n}\n\nfragment SessionFragment on Session {\n  id\n  userAgent\n  ipAddress\n  createdAt\n  ...DeleteSessionModalFragment\n}\n\nfragment SessionsClientComponentFragment on Query {\n  ...SessionsSettingsViewFragment\n}\n\nfragment SessionsControllerFragment on Account {\n  sudoModeExpiresAt\n}\n\nfragment SessionsListCurrentSessionFragment on Account {\n  currentSession {\n    ...SessionFragment\n    id\n  }\n}\n\nfragment SessionsListFragment on Account {\n  ...SessionsControllerFragment\n  ...SessionsListInternalFragment\n  ...SessionsListCurrentSessionFragment\n  ...SessionAccountSudoFragment\n}\n\nfragment SessionsListInternalFragment on Account {\n  sessions(first: 10) {\n    edges {\n      node {\n        id\n        ...SessionFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  id\n}\n\nfragment SessionsSettingsViewFragment on Query {\n  viewer {\n    __typename\n    ... on Account {\n      ...SessionsListFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "06afc86bfca4473dc1bf6de3b1852c75";

export default node;
