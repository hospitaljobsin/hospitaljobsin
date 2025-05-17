/**
 * @generated SignedSource<<95b3fc5b71a8cc5c597437da4ff54dfd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Step2VerificationFormRequestVerificationMutation$variables = {
  email: string;
  recaptchaToken: string;
};
export type Step2VerificationFormRequestVerificationMutation$data = {
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
export type Step2VerificationFormRequestVerificationMutation = {
  response: Step2VerificationFormRequestVerificationMutation$data;
  variables: Step2VerificationFormRequestVerificationMutation$variables;
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
        "selections": (v2/*: any*/),
        "type": "InvalidRecaptchaTokenError",
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
    "name": "Step2VerificationFormRequestVerificationMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Step2VerificationFormRequestVerificationMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "838ca1770196c81ecbb66e3082b8eb19",
    "id": null,
    "metadata": {},
    "name": "Step2VerificationFormRequestVerificationMutation",
    "operationKind": "mutation",
    "text": "mutation Step2VerificationFormRequestVerificationMutation(\n  $email: String!\n  $recaptchaToken: String!\n) {\n  requestEmailVerificationToken(email: $email, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on EmailVerificationTokenCooldownError {\n      message\n      remainingSeconds\n    }\n    ... on RequestEmailVerificationSuccess {\n      message\n      remainingSeconds\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "176198149becad78fa9d18893dac7440";

export default node;
