/**
 * @generated SignedSource<<73ed5f96668a41273ed9c443185b5fb5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AuthProvider = "OAUTH_GOOGLE" | "PASSWORD" | "WEBAUTHN_CREDENTIAL" | "%future added value";
export type LoginFormPasswordMutation$variables = {
  captchaToken: string;
  email: string;
  password: string;
};
export type LoginFormPasswordMutation$data = {
  readonly loginWithPassword: {
    readonly __typename: "InvalidAuthenticationProviderError";
    readonly availableProviders: ReadonlyArray<AuthProvider>;
    readonly message: string;
  } | {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
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
  "name": "password"
},
v3 = [
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
    "name": "password",
    "variableName": "password"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v6 = [
  (v5/*: any*/)
],
v7 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidCredentialsError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidCaptchaTokenError",
  "abstractKey": null
},
v9 = {
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/),
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
v10 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "TwoFactorAuthenticationRequiredError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginFormPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "loginWithPassword",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/)
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
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "LoginFormPasswordMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "loginWithPassword",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
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
    "cacheID": "77977c29bc97c6f660ab4a0563d4e194",
    "id": null,
    "metadata": {},
    "name": "LoginFormPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormPasswordMutation(\n  $email: String!\n  $password: String!\n  $captchaToken: String!\n) {\n  loginWithPassword(email: $email, password: $password, captchaToken: $captchaToken) {\n    __typename\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on InvalidCaptchaTokenError {\n      message\n    }\n    ... on InvalidAuthenticationProviderError {\n      message\n      availableProviders\n    }\n    ... on TwoFactorAuthenticationRequiredError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "38d35f9b0f7e9f50896dc5ffc62f2ba5";

export default node;
