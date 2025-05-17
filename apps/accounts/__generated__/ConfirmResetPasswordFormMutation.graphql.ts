/**
 * @generated SignedSource<<1490a98617bd9815995bb9bb6cfddeeb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConfirmResetPasswordFormMutation$variables = {
  email: string;
  newPassword: string;
  passwordResetToken: string;
};
export type ConfirmResetPasswordFormMutation$data = {
  readonly resetPassword: {
    readonly __typename: "Account";
    readonly __typename: "Account";
  } | {
    readonly __typename: "InvalidPasswordResetTokenError";
    readonly message: string;
  } | {
    readonly __typename: "PasswordNotStrongError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type ConfirmResetPasswordFormMutation = {
  response: ConfirmResetPasswordFormMutation$data;
  variables: ConfirmResetPasswordFormMutation$variables;
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
  "name": "newPassword"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "passwordResetToken"
},
v3 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "newPassword",
    "variableName": "newPassword"
  },
  {
    "kind": "Variable",
    "name": "passwordResetToken",
    "variableName": "passwordResetToken"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidPasswordResetTokenError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "PasswordNotStrongError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ConfirmResetPasswordFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "resetPassword",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ConfirmResetPasswordFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "resetPassword",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
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
    "cacheID": "7881415f8ee8c9c8b023afc3e8d12160",
    "id": null,
    "metadata": {},
    "name": "ConfirmResetPasswordFormMutation",
    "operationKind": "mutation",
    "text": "mutation ConfirmResetPasswordFormMutation(\n  $email: String!\n  $passwordResetToken: String!\n  $newPassword: String!\n) {\n  resetPassword(email: $email, passwordResetToken: $passwordResetToken, newPassword: $newPassword) {\n    __typename\n    ... on Account {\n      __typename\n    }\n    ... on InvalidPasswordResetTokenError {\n      message\n    }\n    ... on PasswordNotStrongError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "268102119a5a63a259387594283249dc";

export default node;
