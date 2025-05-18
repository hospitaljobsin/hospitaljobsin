/**
 * @generated SignedSource<<0eb29d71d54821c7984596b3e5609e48>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LoginFormPasskeyMutation$variables = {
  authenticationResponse: any;
  captchaToken: string;
};
export type LoginFormPasskeyMutation$data = {
  readonly loginWithPasskey: {
    readonly __typename: "Account";
    readonly __typename: "Account";
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
  "type": "InvalidCaptchaTokenError",
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
    "cacheID": "4fda42b73a2f469a4541a6fe1f4c2492",
    "id": null,
    "metadata": {},
    "name": "LoginFormPasskeyMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormPasskeyMutation($authenticationResponse:JSON!,$captchaToken:String!){loginWithPasskey(authenticationResponse:$authenticationResponse,captchaToken:$captchaToken){__typename,...on Account{__typename},...on InvalidPasskeyAuthenticationCredentialError{message},...on InvalidCaptchaTokenError{message},...on WebAuthnChallengeNotFoundError{message},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "2a8ef8b5d335a6ed092a6e39436f905a";

export default node;
