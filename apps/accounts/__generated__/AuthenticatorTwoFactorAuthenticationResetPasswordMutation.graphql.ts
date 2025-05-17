/**
 * @generated SignedSource<<55eac975a56a097f1515252d0223d2f0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AuthenticatorTwoFactorAuthenticationResetPasswordMutation$variables = {
  email: string;
  passwordResetToken: string;
  recaptchaToken: string;
  twoFactorToken: string;
};
export type AuthenticatorTwoFactorAuthenticationResetPasswordMutation$data = {
  readonly verify2faPasswordResetWithAuthenticator: {
    readonly __typename: "AuthenticatorNotEnabledError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidPasswordResetTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "PasswordResetToken";
    readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type AuthenticatorTwoFactorAuthenticationResetPasswordMutation = {
  response: AuthenticatorTwoFactorAuthenticationResetPasswordMutation$data;
  variables: AuthenticatorTwoFactorAuthenticationResetPasswordMutation$variables;
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
  "name": "passwordResetToken"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recaptchaToken"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "twoFactorToken"
},
v4 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "passwordResetToken",
    "variableName": "passwordResetToken"
  },
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
  },
  {
    "kind": "Variable",
    "name": "twoFactorToken",
    "variableName": "twoFactorToken"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v7 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidPasswordResetTokenError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidCredentialsError",
  "abstractKey": null
},
v9 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "AuthenticatorNotEnabledError",
  "abstractKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidRecaptchaTokenError",
  "abstractKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuthenticatorTwoFactorAuthenticationResetPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faPasswordResetWithAuthenticator",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ResetPasswordViewFragment"
              }
            ],
            "type": "PasswordResetToken",
            "abstractKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/)
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
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "AuthenticatorTwoFactorAuthenticationResetPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faPasswordResetWithAuthenticator",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v11/*: any*/),
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
          },
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v11/*: any*/)
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
    "cacheID": "8b3d01a8e65faacf95383ac095945765",
    "id": null,
    "metadata": {},
    "name": "AuthenticatorTwoFactorAuthenticationResetPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation AuthenticatorTwoFactorAuthenticationResetPasswordMutation(\n  $email: String!\n  $passwordResetToken: String!\n  $twoFactorToken: String!\n  $recaptchaToken: String!\n) {\n  verify2faPasswordResetWithAuthenticator(email: $email, passwordResetToken: $passwordResetToken, twoFactorToken: $twoFactorToken, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on PasswordResetToken {\n      ...ResetPasswordViewFragment\n    }\n    ... on InvalidPasswordResetTokenError {\n      message\n    }\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on AuthenticatorNotEnabledError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ResetPasswordViewFragment on PasswordResetToken {\n  id\n  needs2fa\n  ...TwoFactorAuthenticationResetPasswordFragment\n}\n\nfragment TwoFactorAuthenticationResetPasswordFragment on PasswordResetToken {\n  twoFactorProviders\n  authProviders\n}\n"
  }
};
})();

(node as any).hash = "3b7d63155c1417ffac1c81e25d17ff1b";

export default node;
