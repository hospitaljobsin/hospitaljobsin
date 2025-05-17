/**
 * @generated SignedSource<<14a2388e166f71fcc0b0b64200774565>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LoginFormPasskeyMutation$variables = {
  authenticationResponse: any;
  recaptchaToken: string;
};
export type LoginFormPasskeyMutation$data = {
  readonly loginWithPasskey: {
    readonly __typename: "Account";
    readonly __typename: "Account";
  } | {
    readonly __typename: "InvalidPasskeyAuthenticationCredentialError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
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
    "name": "recaptchaToken"
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
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v4 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "InvalidPasskeyAuthenticationCredentialError",
  "abstractKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "InvalidRecaptchaTokenError",
  "abstractKey": null
},
v6 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
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
          (v5/*: any*/),
          (v6/*: any*/)
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
          (v5/*: any*/),
          (v6/*: any*/),
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
    "cacheID": "53bbe1a44676cc93b926cfe4c1f04174",
    "id": null,
    "metadata": {},
    "name": "LoginFormPasskeyMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormPasskeyMutation(\n  $authenticationResponse: JSON!\n  $recaptchaToken: String!\n) {\n  loginWithPasskey(authenticationResponse: $authenticationResponse, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on Account {\n      __typename\n    }\n    ... on InvalidPasskeyAuthenticationCredentialError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on WebAuthnChallengeNotFoundError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "742bff9f2526b0e8342e4f509f4dba04";

export default node;
