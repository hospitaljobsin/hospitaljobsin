/**
 * @generated SignedSource<<53d80847660c30c43a44db036abab583>>
 * @relayHash c29c50e6ffc19df4b6bd435c29f5ee9e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c29c50e6ffc19df4b6bd435c29f5ee9e

import type { ConcreteRequest } from 'relay-runtime';
export type DeleteSessionModalMutation$variables = {
  connections: ReadonlyArray<string>;
  sessionId: string;
};
export type DeleteSessionModalMutation$data = {
  readonly deleteSession: {
    readonly sessionEdge?: {
      readonly node: {
        readonly id: string;
      };
    };
  };
};
export type DeleteSessionModalMutation = {
  response: DeleteSessionModalMutation$data;
  variables: DeleteSessionModalMutation$variables;
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
  "name": "sessionId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "sessionId",
    "variableName": "sessionId"
  }
],
v3 = {
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteSessionModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteSession",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SessionEdge",
                "kind": "LinkedField",
                "name": "sessionEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Session",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "DeleteSessionSuccess",
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "DeleteSessionModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteSession",
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
                "concreteType": "SessionEdge",
                "kind": "LinkedField",
                "name": "sessionEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Session",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
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
            "type": "DeleteSessionSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "c29c50e6ffc19df4b6bd435c29f5ee9e",
    "metadata": {},
    "name": "DeleteSessionModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "7698dc953e4e3ac95f885c648eb0322f";

export default node;
