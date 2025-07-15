/**
 * @generated SignedSource<<41e1c9f922cfca0fca342b7c43e5a03a>>
 * @relayHash 8b7176c8fe53d73c9a75278b2c971437
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8b7176c8fe53d73c9a75278b2c971437

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type NewJobClientComponentQuery$variables = {
  slug: string;
};
export type NewJobClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"NewJobViewFragment">;
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
        "name": "NewJobViewFragment"
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
    "id": "8b7176c8fe53d73c9a75278b2c971437",
    "metadata": {},
    "name": "NewJobClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "3bd58e53e224ca5b87f2cc505c7b1d05";

export default node;
