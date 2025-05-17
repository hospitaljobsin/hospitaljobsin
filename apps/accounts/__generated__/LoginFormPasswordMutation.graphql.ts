/**
 * @generated SignedSource<<9bda32758eb9b55ea8372b8a2bd83427>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AuthProvider = "OAUTH_GOOGLE" | "PASSWORD" | "WEBAUTHN_CREDENTIAL" | "%future added value";
export type LoginFormPasswordMutation$variables = {
  email: string;
  password: string;
  recaptchaToken: string;
};
export type LoginFormPasswordMutation$data = {
  readonly loginWithPassword: {
    readonly __typename: "InvalidAuthenticationProviderError";
    readonly availableProviders: ReadonlyArray<AuthProvider>;
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "TwoFactorAuthenticationRequiredError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type LoginFormPasswordMutation = {
  response: LoginFormPasswordMutation$data;
  variables: LoginFormPasswordMutation$variables;
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
    "name": "password"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recaptchaToken"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "password",
    "variableName": "password"
  },
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v4 = [
  (v3/*: any*/)
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
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "availableProviders",
      "storageKey": null
    }
  ],
  "type": "InvalidAuthenticationProviderError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "TwoFactorAuthenticationRequiredError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginFormPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "loginWithPassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoginFormPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "loginWithPassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "cacheID": "8578a559724503cf3439aa6bf2b091d4",
    "id": null,
    "metadata": {},
    "name": "LoginFormPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormPasswordMutation(\n  $email: String!\n  $password: String!\n  $recaptchaToken: String!\n) {\n  loginWithPassword(email: $email, password: $password, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on InvalidAuthenticationProviderError {\n      message\n      availableProviders\n    }\n    ... on TwoFactorAuthenticationRequiredError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4ccdda839d8b3e6c751eac2ae898c01d";

export default node;
