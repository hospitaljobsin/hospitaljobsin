/**
 * @generated SignedSource<<7bddcf1a6b5b29efa7eae5f02b6e5ec9>>
 * @relayHash da522990d0ec2b81bf8e372682f2340a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID da522990d0ec2b81bf8e372682f2340a

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type NewJobClientComponentQuery$variables = {
  slug: string;
};
export type NewJobClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"NewJobContentFragment">;
};
export type NewJobClientComponentQuery = {
  response: NewJobClientComponentQuery$data;
  variables: NewJobClientComponentQuery$variables;
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
    "name": "NewJobClientComponentQuery",
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
    "name": "NewJobClientComponentQuery",
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
    "id": "da522990d0ec2b81bf8e372682f2340a",
    "metadata": {},
    "name": "NewJobClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "aa3802a0bd981449b97596ac4831954b";

export default node;
