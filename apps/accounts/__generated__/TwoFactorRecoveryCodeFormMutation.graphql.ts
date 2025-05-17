/**
 * @generated SignedSource<<9e92957a1518dceb4351f9e9d005dfed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TwoFactorRecoveryCodeFormMutation$variables = {
  recaptchaToken: string;
  token: string;
};
export type TwoFactorRecoveryCodeFormMutation$data = {
  readonly verify2faWithRecoveryCode: {
    readonly __typename: "InvalidCredentialsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "TwoFactorAuthenticationChallengeNotFoundError";
    readonly message: string;
  } | {
    readonly __typename: "TwoFactorAuthenticationNotEnabledError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type TwoFactorRecoveryCodeFormMutation = {
  response: TwoFactorRecoveryCodeFormMutation$data;
  variables: TwoFactorRecoveryCodeFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recaptchaToken"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "token"
},
v2 = [
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
  },
  {
    "kind": "Variable",
    "name": "token",
    "variableName": "token"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v5 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "TwoFactorAuthenticationChallengeNotFoundError",
  "abstractKey": null
},
v6 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "InvalidRecaptchaTokenError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "TwoFactorAuthenticationNotEnabledError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "InvalidCredentialsError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TwoFactorRecoveryCodeFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faWithRecoveryCode",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
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
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "TwoFactorRecoveryCodeFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faWithRecoveryCode",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
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
    "cacheID": "3b6b134ee801d2a03f4516c102ad58c3",
    "id": null,
    "metadata": {},
    "name": "TwoFactorRecoveryCodeFormMutation",
    "operationKind": "mutation",
    "text": "mutation TwoFactorRecoveryCodeFormMutation(\n  $token: String!\n  $recaptchaToken: String!\n) {\n  verify2faWithRecoveryCode(token: $token, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on TwoFactorAuthenticationChallengeNotFoundError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on TwoFactorAuthenticationNotEnabledError {\n      message\n    }\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d95ff8901b6e86cf6906eb8adf7785bb";

export default node;
