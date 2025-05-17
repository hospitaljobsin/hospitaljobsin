/**
 * @generated SignedSource<<962a856b0ee52f07e518b14bf45e461e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SubmitResetPasswordFormMutation$variables = {
  email: string;
  recaptchaToken: string;
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recaptchaToken"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "recaptchaToken",
        "variableName": "recaptchaToken"
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
          (v1/*: any*/)
        ],
        "type": "InvalidRecaptchaTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SubmitResetPasswordFormMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SubmitResetPasswordFormMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "de4fede297c48090fbd116e9d18783d0",
    "id": null,
    "metadata": {},
    "name": "SubmitResetPasswordFormMutation",
    "operationKind": "mutation",
    "text": "mutation SubmitResetPasswordFormMutation(\n  $email: String!\n  $recaptchaToken: String!\n) {\n  requestPasswordReset(email: $email, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on PasswordResetTokenCooldownError {\n      message\n      remainingSeconds\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f8f60818798fdc68bba1913eb72c0f9c";

export default node;
