/**
 * @generated SignedSource<<09a4c1c8941330be4da065589b04762b>>
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
  email: string;
  passwordResetToken: string;
  recaptchaToken: string;
};
export type PasskeyTwoFactorAuthenticationResetPasswordMutation$data = {
  readonly verify2faPasswordResetWithPasskey: {
    readonly __typename: "InvalidPasskeyAuthenticationCredentialError";
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
  "name": "email"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "passwordResetToken"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recaptchaToken"
},
v4 = [
  {
    "kind": "Variable",
    "name": "authenticationResponse",
    "variableName": "authenticationResponse"
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
  },
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
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
  "type": "InvalidRecaptchaTokenError",
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/)
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
    "cacheID": "b9072a72da23ba60ee4eaa128765f4f3",
    "id": null,
    "metadata": {},
    "name": "PasskeyTwoFactorAuthenticationResetPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyTwoFactorAuthenticationResetPasswordMutation(\n  $email: String!\n  $passwordResetToken: String!\n  $authenticationResponse: JSON!\n  $recaptchaToken: String!\n) {\n  verify2faPasswordResetWithPasskey(email: $email, passwordResetToken: $passwordResetToken, authenticationResponse: $authenticationResponse, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on PasswordResetToken {\n      ...ResetPasswordViewFragment\n    }\n    ... on InvalidPasswordResetTokenError {\n      message\n    }\n    ... on InvalidPasskeyAuthenticationCredentialError {\n      message\n    }\n    ... on TwoFactorAuthenticationNotEnabledError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on WebAuthnChallengeNotFoundError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ResetPasswordViewFragment on PasswordResetToken {\n  id\n  needs2fa\n  ...TwoFactorAuthenticationResetPasswordFragment\n}\n\nfragment TwoFactorAuthenticationResetPasswordFragment on PasswordResetToken {\n  twoFactorProviders\n  authProviders\n}\n"
  }
};
})();

(node as any).hash = "6140ec759046350790b5df8c6ba8ba80";

export default node;
