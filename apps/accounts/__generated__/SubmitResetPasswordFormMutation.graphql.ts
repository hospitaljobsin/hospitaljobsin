/**
 * @generated SignedSource<<9a89f1d7a7ddb2e6039a6d9655e214ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SubmitResetPasswordFormMutation$variables = {
  captchaToken: string;
  email: string;
};
export type SubmitResetPasswordFormMutation$data = {
  readonly requestPasswordReset: {
    readonly __typename: "InvalidRecaptchaTokenError";
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
        "type": "InvalidRecaptchaTokenError",
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
    "cacheID": "3ebaf79a618dd3b3043fd2b239ab0ea7",
    "id": null,
    "metadata": {},
    "name": "SubmitResetPasswordFormMutation",
    "operationKind": "mutation",
    "text": "mutation SubmitResetPasswordFormMutation(\n  $email: String!\n  $captchaToken: String!\n) {\n  requestPasswordReset(email: $email, captchaToken: $captchaToken) {\n    __typename\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on PasswordResetTokenCooldownError {\n      message\n      remainingSeconds\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "845e298eebf0e8429e5029187d005968";

export default node;
