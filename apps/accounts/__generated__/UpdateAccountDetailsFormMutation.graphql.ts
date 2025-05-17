/**
 * @generated SignedSource<<9d98b8dd038e0d20359bac2e5f7ad604>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateAccountDetailsFormMutation$variables = {
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fullName"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "fullName",
    "variableName": "fullName"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateAccountDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateAccountDetailsFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "cacheID": "192a69aee5e7dae40ae47ab4c63f0873",
    "id": null,
    "metadata": {},
    "name": "UpdateAccountDetailsFormMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateAccountDetailsFormMutation(\n  $fullName: String!\n) {\n  updateAccount(fullName: $fullName) {\n    __typename\n    ... on Account {\n      ...UpdateAccountDetailsFormFragment\n      ...AccountDetailsFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment AccountDetailsFragment on Account {\n  fullName\n  email\n  avatarUrl(size: 120)\n}\n\nfragment UpdateAccountDetailsFormFragment on Account {\n  fullName\n  email\n  avatarUrl(size: 120)\n}\n"
  }
};
})();

(node as any).hash = "4b824b87f596744724d561b3e247111d";

export default node;
