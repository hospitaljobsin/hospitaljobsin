/**
 * @generated SignedSource<<9cefa7df56c4109b537489082be1a667>>
 * @relayHash 63dfd3c9f8cebdc3d9561674774ee00c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 63dfd3c9f8cebdc3d9561674774ee00c

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationMembersMetadataQuery$variables = {
  slug: string;
};
export type pageOrganizationMembersMetadataQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationMembersMetadataFragment">;
};
export type pageOrganizationMembersMetadataQuery = {
  response: pageOrganizationMembersMetadataQuery$data;
  variables: pageOrganizationMembersMetadataQuery$variables;
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
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "descriptionCleaned",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerUrl",
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
    "name": "pageOrganizationMembersMetadataQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageOrganizationMembersMetadataFragment",
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
        "args": (v1/*: any*/),
        "argumentDefinitions": (v0/*: any*/)
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageOrganizationMembersMetadataQuery",
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
    "id": "63dfd3c9f8cebdc3d9561674774ee00c",
    "metadata": {},
    "name": "pageOrganizationMembersMetadataQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "d42709131b7498e00c44db1aec4a78f7";

export default node;
