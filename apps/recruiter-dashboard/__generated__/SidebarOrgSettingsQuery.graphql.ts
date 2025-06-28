/**
 * @generated SignedSource<<603c69cdb3a67d7b52b17169ec95022d>>
 * @relayHash c76ac79467250329c0c9072dbf0f5e50
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c76ac79467250329c0c9072dbf0f5e50

import type { ConcreteRequest } from 'relay-runtime';
export type SidebarOrgSettingsQuery$variables = {
  slug: string;
};
export type SidebarOrgSettingsQuery$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isAdmin: boolean;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type SidebarOrgSettingsQuery = {
  response: SidebarOrgSettingsQuery$data;
  variables: SidebarOrgSettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAdmin",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SidebarOrgSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SidebarOrgSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
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
    "id": "c76ac79467250329c0c9072dbf0f5e50",
    "metadata": {},
    "name": "SidebarOrgSettingsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "27965dc3354fec1c46ec9c6dc54f6fd7";

export default node;
