/**
 * @generated SignedSource<<c3445f8a5a4ea6653cfbe20720aae12f>>
 * @relayHash abf4e0e743bea839c944b251111d1e3e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID abf4e0e743bea839c944b251111d1e3e

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageNewJobQuery$variables = {
  slug: string;
};
export type pageNewJobQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"NewJobContentFragment">;
};
export type pageNewJobQuery = {
  response: pageNewJobQuery$data;
  variables: pageNewJobQuery$variables;
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageNewJobQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "NewJobContentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageNewJobQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
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
                "kind": "ScalarField",
                "name": "isAdmin",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "type": "Organization",
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
    "id": "abf4e0e743bea839c944b251111d1e3e",
    "metadata": {},
    "name": "pageNewJobQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "1be56f94cc67a9abddf7af3d3eb377a4";

export default node;
