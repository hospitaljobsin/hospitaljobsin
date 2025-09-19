/**
 * @generated SignedSource<<49e2388d51e16f4d78b67de97697cc59>>
 * @relayHash 15daf27dbe44544f9b4214a13d8544d2
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 15daf27dbe44544f9b4214a13d8544d2

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateAccountDetailsFormMutation$variables = {
  avatarUrl?: string | null | undefined;
  fullName: string;
};
export type UpdateAccountDetailsFormMutation$data = {
  readonly updateAccount: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment" | "AuthNavigationFragment" | "UpdateAccountDetailsFormFragment">;
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
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AuthNavigationFragment"
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
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
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
    "id": "15daf27dbe44544f9b4214a13d8544d2",
    "metadata": {},
    "name": "UpdateAccountDetailsFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "33d84984dda3410bbafe7100bb056f73";

export default node;
