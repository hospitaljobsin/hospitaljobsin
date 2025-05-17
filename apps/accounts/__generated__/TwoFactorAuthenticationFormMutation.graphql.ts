/**
 * @generated SignedSource<<b60dafabff17bc5596cacb21730dd651>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TwoFactorAuthenticationFormMutation$variables = {
  recaptchaToken: string;
  token: string;
};
export type TwoFactorAuthenticationFormMutation$data = {
  readonly verify2faWithAuthenticator: {
    readonly __typename: "Account";
    readonly __typename: "Account";
  } | {
    readonly __typename: "AuthenticatorNotEnabledError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "TwoFactorAuthenticationChallengeNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type TwoFactorAuthenticationFormMutation = {
  response: TwoFactorAuthenticationFormMutation$data;
  variables: TwoFactorAuthenticationFormMutation$variables;
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
  "type": "AuthenticatorNotEnabledError",
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
    "name": "TwoFactorAuthenticationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faWithAuthenticator",
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
    "name": "TwoFactorAuthenticationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verify2faWithAuthenticator",
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
    "cacheID": "d61ccd3af5477b29e2e1774b53f04cef",
    "id": null,
    "metadata": {},
    "name": "TwoFactorAuthenticationFormMutation",
    "operationKind": "mutation",
    "text": "mutation TwoFactorAuthenticationFormMutation(\n  $token: String!\n  $recaptchaToken: String!\n) {\n  verify2faWithAuthenticator(token: $token, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on TwoFactorAuthenticationChallengeNotFoundError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on AuthenticatorNotEnabledError {\n      message\n    }\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on Account {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "aa8b29ca33978b35e785cff71c339dca";

export default node;
