/**
 * @generated SignedSource<<37e8c7ee667d716e37b7251da444fea3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageResetPasswordViewQuery$variables = {
  email: string;
  resetToken: string;
};
export type pageResetPasswordViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewClientComponentFragment" | "pagePasswordResetTokenMetadataFragment">;
};
export type pageResetPasswordViewQuery = {
  response: pageResetPasswordViewQuery$data;
  variables: pageResetPasswordViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resetToken"
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v3 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "resetToken",
    "variableName": "resetToken"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v2/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageResetPasswordViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pagePasswordResetTokenMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "passwordResetToken",
            "plural": false,
            "selections": [
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "args": (v3/*: any*/),
        "argumentDefinitions": (v2/*: any*/)
      },
      {
        "args": (v3/*: any*/),
        "kind": "FragmentSpread",
        "name": "ResetPasswordViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageResetPasswordViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "passwordResetToken",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "needs2fa",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "twoFactorProviders",
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
            "type": "PasswordResetToken",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9471c698619fc4fc6d2e258e10ebec1c",
    "id": null,
    "metadata": {},
    "name": "pageResetPasswordViewQuery",
    "operationKind": "query",
    "text": "query pageResetPasswordViewQuery(\n  $resetToken: String!\n  $email: String!\n) {\n  ...pagePasswordResetTokenMetadataFragment_3hmrkP\n  ...ResetPasswordViewClientComponentFragment_3hmrkP\n}\n\nfragment ResetPasswordViewClientComponentFragment_3hmrkP on Query {\n  passwordResetToken(resetToken: $resetToken, email: $email) {\n    __typename\n    ... on PasswordResetToken {\n      ...ResetPasswordViewFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ResetPasswordViewFragment on PasswordResetToken {\n  id\n  needs2fa\n  ...TwoFactorAuthenticationResetPasswordFragment\n}\n\nfragment TwoFactorAuthenticationResetPasswordFragment on PasswordResetToken {\n  twoFactorProviders\n  authProviders\n}\n\nfragment pagePasswordResetTokenMetadataFragment_3hmrkP on Query {\n  passwordResetToken(resetToken: $resetToken, email: $email) {\n    __typename\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "11a64098f7a4c4734d02401a66e0fc0d";

export default node;
