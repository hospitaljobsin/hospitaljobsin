/**
 * @generated SignedSource<<415363f4b77b4b5323d8ea6e9a061263>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdatePasswordModalMutation$variables = {
  newPassword: string;
};
export type UpdatePasswordModalMutation$data = {
  readonly updatePassword: {
    readonly __typename: "Account";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PasswordFragment" | "UpdatePasswordModalFragment">;
  } | {
    readonly __typename: "PasswordNotStrongError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type UpdatePasswordModalMutation = {
  response: UpdatePasswordModalMutation$data;
  variables: UpdatePasswordModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "newPassword"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "newPassword",
    "variableName": "newPassword"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "PasswordNotStrongError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdatePasswordModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updatePassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PasswordFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdatePasswordModalFragment"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v4/*: any*/)
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
    "name": "UpdatePasswordModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updatePassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
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
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
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
    "cacheID": "5ba69a65199a48fb015f4baceb27edd5",
    "id": null,
    "metadata": {},
    "name": "UpdatePasswordModalMutation",
    "operationKind": "mutation",
    "text": "mutation UpdatePasswordModalMutation(\n  $newPassword: String!\n) {\n  updatePassword(newPassword: $newPassword) {\n    __typename\n    ... on Account {\n      id\n      ...PasswordFragment\n      ...UpdatePasswordModalFragment\n    }\n    ... on PasswordNotStrongError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment PasswordFragment on Account {\n  sudoModeExpiresAt\n  authProviders\n  ...UpdatePasswordModalFragment\n}\n\nfragment UpdatePasswordModalFragment on Account {\n  authProviders\n}\n"
  }
};
})();

(node as any).hash = "34ec9db94a806cee506bddfa6681b9c9";

export default node;
