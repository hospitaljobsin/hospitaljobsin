/**
 * @generated SignedSource<<580994585174d0d3148ac723187d7890>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Step1EmailFormMutation$variables = {
  captchaToken: string;
  email: string;
};
export type Step1EmailFormMutation$data = {
  readonly requestEmailVerificationToken: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "EmailVerificationTokenCooldownError";
    readonly message: string;
    readonly remainingSeconds: number;
  } | {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailError";
    readonly message: string;
  } | {
    readonly __typename: "RequestEmailVerificationSuccess";
    readonly message: string;
    readonly remainingSeconds: number;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type Step1EmailFormMutation = {
  response: Step1EmailFormMutation$data;
  variables: Step1EmailFormMutation$variables;
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
  (v2/*: any*/)
],
v4 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "remainingSeconds",
    "storageKey": null
  }
],
v5 = [
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
    "name": "requestEmailVerificationToken",
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
        "type": "InvalidEmailError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v4/*: any*/),
        "type": "EmailVerificationTokenCooldownError",
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
        "selections": (v4/*: any*/),
        "type": "RequestEmailVerificationSuccess",
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
    "name": "Step1EmailFormMutation",
    "selections": (v5/*: any*/),
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
    "name": "Step1EmailFormMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "e0909f8e99444d9710f8320a7f35d6fe",
    "id": null,
    "metadata": {},
    "name": "Step1EmailFormMutation",
    "operationKind": "mutation",
    "text": "mutation Step1EmailFormMutation(\n  $email: String!\n  $captchaToken: String!\n) {\n  requestEmailVerificationToken(email: $email, captchaToken: $captchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailError {\n      message\n    }\n    ... on EmailVerificationTokenCooldownError {\n      message\n      remainingSeconds\n    }\n    ... on InvalidCaptchaTokenError {\n      message\n    }\n    ... on RequestEmailVerificationSuccess {\n      message\n      remainingSeconds\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "60a13c0c1e5d353bd6d0b4428277022c";

export default node;
