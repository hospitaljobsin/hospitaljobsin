/**
 * @generated SignedSource<<05d92fb3e1be9048f9fa1a356f7b6cff>>
 * @relayHash f808fa7bb2d7f23bfb1fb75611805589
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f808fa7bb2d7f23bfb1fb75611805589

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateAccountDetailsFormMutation$variables = {
  avatarUrl?: string | null | undefined;
  fullName: string;
};
export type UpdateAccountDetailsFormMutation$data = {
  readonly updateAccount: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment" | "UpdateAccountDetailsFormFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type UpdateAccountDetailsFormMutation = {
  response: UpdateAccountDetailsFormMutation$data;
  variables: UpdateAccountDetailsFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "avatarUrl"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fullName"
},
v2 = [
  {
    "kind": "Variable",
    "name": "avatarUrl",
    "variableName": "avatarUrl"
  },
  {
    "kind": "Variable",
    "name": "fullName",
    "variableName": "fullName"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
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
    "name": "UpdateAccountDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccount",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateAccountDetailsFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AccountDetailsFragment"
              }
            ],
            "type": "Account",
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
    "name": "UpdateAccountDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccount",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 120
                  }
                ],
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": "avatarUrl(size:120)"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
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
    "id": "f808fa7bb2d7f23bfb1fb75611805589",
    "metadata": {},
    "name": "UpdateAccountDetailsFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "339879955d88c3754ff3286dd768433d";

export default node;
