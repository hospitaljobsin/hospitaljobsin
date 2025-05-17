/**
 * @generated SignedSource<<31a128211ec0e0277b8dfc0ef51ddb3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PasskeyTwoFactorAuthenticationResetPasswordMutation$variables = {
  authenticationResponse: any;
  captchaToken: string;
  email: string;
  passwordResetToken: string;
};
export type PasskeyTwoFactorAuthenticationResetPasswordMutation$data = {
  readonly verify2faPasswordResetWithPasskey: {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidPasskeyAuthenticationCredentialError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidPasswordResetTokenError";
    readonly message: string;
  } | {
    readonly __typename: "PasswordResetToken";
    readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewFragment">;
  } | {
    readonly __typename: "TwoFactorAuthenticationNotEnabledError";
    readonly message: string;
  } | {
    readonly __typename: "WebAuthnChallengeNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PasskeyTwoFactorAuthenticationResetPasswordMutation = {
  response: PasskeyTwoFactorAuthenticationResetPasswordMutation$data;
  variables: PasskeyTwoFactorAuthenticationResetPasswordMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "authenticationResponse"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "captchaToken"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "passwordResetToken"
},
v4 = [
  {
    "kind": "Variable",
    "name": "authenticationResponse",
    "variableName": "authenticationResponse"
  },
  {
    "kind": "Variable",
    "name": "captchaToken",
    "variableName": "captchaToken"
  },
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "passwordResetToken",
    "variableName": "passwordResetToken"
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
  "type": "InvalidPasskeyAuthenticationCredentialError",
  "abstractKey": null
},
v9 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "TwoFactorAuthenticationNotEnabledError",
  "abstractKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidCaptchaTokenError",
  "abstractKey": null
},
v11 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "WebAuthnChallengeNotFoundError",
  "abstractKey": null
},
v12 = {
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
    "name": "PasskeyTwoFactorAuthenticationResetPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faPasswordResetWithPasskey",
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
          (v10/*: any*/),
          (v11/*: any*/)
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "PasskeyTwoFactorAuthenticationResetPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faPasswordResetWithPasskey",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v12/*: any*/),
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
          (v11/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v12/*: any*/)
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
    "cacheID": "d1a2ad577f247f799bee2dce0e223b79",
    "id": null,
    "metadata": {},
    "name": "PasskeyTwoFactorAuthenticationResetPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyTwoFactorAuthenticationResetPasswordMutation(\n  $email: String!\n  $passwordResetToken: String!\n  $authenticationResponse: JSON!\n  $captchaToken: String!\n) {\n  verify2faPasswordResetWithPasskey(email: $email, passwordResetToken: $passwordResetToken, authenticationResponse: $authenticationResponse, captchaToken: $captchaToken) {\n    __typename\n    ... on PasswordResetToken {\n      ...ResetPasswordViewFragment\n    }\n    ... on InvalidPasswordResetTokenError {\n      message\n    }\n    ... on InvalidPasskeyAuthenticationCredentialError {\n      message\n    }\n    ... on TwoFactorAuthenticationNotEnabledError {\n      message\n    }\n    ... on InvalidCaptchaTokenError {\n      message\n    }\n    ... on WebAuthnChallengeNotFoundError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ResetPasswordViewFragment on PasswordResetToken {\n  id\n  needs2fa\n  ...TwoFactorAuthenticationResetPasswordFragment\n}\n\nfragment TwoFactorAuthenticationResetPasswordFragment on PasswordResetToken {\n  twoFactorProviders\n  authProviders\n}\n"
  }
};
})();

(node as any).hash = "46ccb465a3cb829bdec692493baa3822";

export default node;
