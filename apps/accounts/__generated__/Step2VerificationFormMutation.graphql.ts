/**
 * @generated SignedSource<<695de33bd7839a82a0b833d417c23980>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Step2VerificationFormMutation$variables = {
  captchaToken: string;
  email: string;
  emailVerificationToken: string;
};
export type Step2VerificationFormMutation$data = {
  readonly verifyEmail: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailVerificationTokenError";
    readonly message: string;
  } | {
    readonly __typename: "VerifyEmailSuccess";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type Step2VerificationFormMutation = {
  response: Step2VerificationFormMutation$data;
  variables: Step2VerificationFormMutation$variables;
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
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "emailVerificationToken"
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v4 = [
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
      },
      {
        "kind": "Variable",
        "name": "emailVerificationToken",
        "variableName": "emailVerificationToken"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "verifyEmail",
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
        "selections": (v3/*: any*/),
        "type": "EmailInUseError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "InvalidEmailVerificationTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "InvalidCaptchaTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "VerifyEmailSuccess",
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "Step2VerificationFormMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "Step2VerificationFormMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "a0d4c1cfae30853b232ac6f73b359548",
    "id": null,
    "metadata": {},
    "name": "Step2VerificationFormMutation",
    "operationKind": "mutation",
    "text": "mutation Step2VerificationFormMutation(\n  $email: String!\n  $emailVerificationToken: String!\n  $captchaToken: String!\n) {\n  verifyEmail(email: $email, emailVerificationToken: $emailVerificationToken, captchaToken: $captchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailVerificationTokenError {\n      message\n    }\n    ... on InvalidCaptchaTokenError {\n      message\n    }\n    ... on VerifyEmailSuccess {\n      message\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "90c61bca7d6286a9b71c38b7b5e27c8b";

export default node;
