/**
 * @generated SignedSource<<0696054de46d25fac05de26262cf0dd8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type Step2VerificationFormRequestVerificationMutation$variables = {
  captchaToken: string;
  email: string;
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
export type Step2VerificationFormRequestVerificationMutation = {
  response: Step2VerificationFormRequestVerificationMutation$data;
  variables: Step2VerificationFormRequestVerificationMutation$variables;
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
        "selections": (v3/*: any*/),
        "type": "InvalidCaptchaTokenError",
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
    "name": "Step2VerificationFormRequestVerificationMutation",
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
    "name": "Step2VerificationFormRequestVerificationMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "10c26258de62e48fe3a80a70170c31f1",
    "id": null,
    "metadata": {},
    "name": "Step2VerificationFormRequestVerificationMutation",
    "operationKind": "mutation",
    "text": "mutation Step2VerificationFormRequestVerificationMutation($email:String!,$captchaToken:String!){requestEmailVerificationToken(email:$email,captchaToken:$captchaToken){__typename,...on EmailInUseError{message},...on InvalidEmailError{message},...on InvalidCaptchaTokenError{message},...on EmailVerificationTokenCooldownError{message,remainingSeconds},...on RequestEmailVerificationSuccess{message,remainingSeconds}}}"
  }
};
})();

(node as any).hash = "8a684e817e5d7f1f93444f53b34703f6";

export default node;
