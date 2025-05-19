/**
 * @generated SignedSource<<5c026947414f0e316f3a21df6a9366f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type SubmitResetPasswordFormMutation$variables = {
  captchaToken: string;
  email: string;
};
export type SubmitResetPasswordFormMutation$data = {
  readonly requestPasswordReset: {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "PasswordResetTokenCooldownError";
    readonly message: string;
    readonly remainingSeconds: number;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type SubmitResetPasswordFormMutation = {
  response: SubmitResetPasswordFormMutation$data;
  variables: SubmitResetPasswordFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "captchaToken"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "captchaToken",
        "variableName": "captchaToken"
      },
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "requestPasswordReset",
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
          (v2/*: any*/)
        ],
        "type": "InvalidCaptchaTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "remainingSeconds",
            "storageKey": null
          }
        ],
        "type": "PasswordResetTokenCooldownError",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SubmitResetPasswordFormMutation",
    "selections": (v3/*: any*/),
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
    "name": "SubmitResetPasswordFormMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "a4963a1e951fe7cd5b463c9dd405d573",
    "id": null,
    "metadata": {},
    "name": "SubmitResetPasswordFormMutation",
    "operationKind": "mutation",
    "text": "mutation SubmitResetPasswordFormMutation($email:String!,$captchaToken:String!){requestPasswordReset(email:$email,captchaToken:$captchaToken){__typename,...on InvalidCaptchaTokenError{message},...on PasswordResetTokenCooldownError{message,remainingSeconds}}}"
  }
};
})();

(node as any).hash = "73a33e988205e0f7a37f67a7c6559052";

export default node;
