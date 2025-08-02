/**
 * @generated SignedSource<<3069457f27567040a693b4c53891ebb8>>
 * @relayHash e67d07afd8a2f3318812ed7738c22934
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e67d07afd8a2f3318812ed7738c22934

import type { ConcreteRequest } from 'relay-runtime';
export type LoginFormPasskeyMutation$variables = {
  authenticationResponse: any;
  captchaToken: string;
};
export type LoginFormPasskeyMutation$data = {
  readonly loginWithPasskey: {
    readonly __typename: "Account";
    readonly __typename: "Account";
    readonly email: string;
    readonly id: string;
  } | {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidPasskeyAuthenticationCredentialError";
    readonly message: string;
  } | {
    readonly __typename: "WebAuthnChallengeNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type LoginFormPasskeyMutation = {
  response: LoginFormPasskeyMutation$data;
  variables: LoginFormPasskeyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "authenticationResponse"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "captchaToken"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "authenticationResponse",
    "variableName": "authenticationResponse"
  },
  {
    "kind": "Variable",
    "name": "captchaToken",
    "variableName": "captchaToken"
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
  "name": "id",
  "storageKey": null
},
v4 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    (v3/*: any*/)
  ],
  "type": "Account",
  "abstractKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidPasskeyAuthenticationCredentialError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidCaptchaTokenError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "WebAuthnChallengeNotFoundError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginFormPasskeyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "loginWithPasskey",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
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
    "name": "LoginFormPasskeyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "loginWithPasskey",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
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
    "id": "e67d07afd8a2f3318812ed7738c22934",
    "metadata": {},
    "name": "LoginFormPasskeyMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "5d960c3898a2c2a52b6c2b3543fcc990";

export default node;
