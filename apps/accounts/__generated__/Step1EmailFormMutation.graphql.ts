/**
 * @generated SignedSource<<21a256ebb4854c98a2a4ffe163d2c1e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Step1EmailFormMutation$variables = {
  email: string;
  recaptchaToken: string;
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
    readonly __typename: "InvalidEmailError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
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
  (v1/*: any*/)
],
v3 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "remainingSeconds",
    "storageKey": null
  }
],
v4 = [
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
        "selections": (v2/*: any*/),
        "type": "EmailInUseError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v2/*: any*/),
        "type": "InvalidEmailError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "EmailVerificationTokenCooldownError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v2/*: any*/),
        "type": "InvalidRecaptchaTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "RequestEmailVerificationSuccess",
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
    "name": "Step1EmailFormMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Step1EmailFormMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "a61b5b334a5d5b22b55b1d3e2c5d8259",
    "id": null,
    "metadata": {},
    "name": "Step1EmailFormMutation",
    "operationKind": "mutation",
    "text": "mutation Step1EmailFormMutation(\n  $email: String!\n  $recaptchaToken: String!\n) {\n  requestEmailVerificationToken(email: $email, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailError {\n      message\n    }\n    ... on EmailVerificationTokenCooldownError {\n      message\n      remainingSeconds\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on RequestEmailVerificationSuccess {\n      message\n      remainingSeconds\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e2870b0a629aab73cdfbb9f2eb8cf398";

export default node;
