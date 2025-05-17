/**
 * @generated SignedSource<<d137dd2929a00b822945c71d60ddcb11>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TwoFactorAuthenticationMutation$variables = {
  recaptchaToken: string;
  twoFactorToken: string;
};
export type TwoFactorAuthenticationMutation$data = {
  readonly requestSudoModeWithAuthenticator: {
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
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type TwoFactorAuthenticationMutation = {
  response: TwoFactorAuthenticationMutation$data;
  variables: TwoFactorAuthenticationMutation$variables;
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
  "name": "twoFactorToken"
},
v2 = [
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
  },
  {
    "kind": "Variable",
    "name": "twoFactorToken",
    "variableName": "twoFactorToken"
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
  "type": "InvalidCredentialsError",
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TwoFactorAuthenticationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestSudoModeWithAuthenticator",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
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
    "name": "TwoFactorAuthenticationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestSudoModeWithAuthenticator",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
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
    "cacheID": "27fe995411361d19110adde23c93c4eb",
    "id": null,
    "metadata": {},
    "name": "TwoFactorAuthenticationMutation",
    "operationKind": "mutation",
    "text": "mutation TwoFactorAuthenticationMutation(\n  $twoFactorToken: String!\n  $recaptchaToken: String!\n) {\n  requestSudoModeWithAuthenticator(twoFactorToken: $twoFactorToken, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on Account {\n      __typename\n    }\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on AuthenticatorNotEnabledError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "facf55f6cdad7aa8e5c0f611cb1724e4";

export default node;
