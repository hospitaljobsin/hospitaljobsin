/**
 * @generated SignedSource<<2da809ff61725f423d93a34bec4bf4d8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type TwoFactorRecoveryCodeFormMutation$variables = {
  captchaToken: string;
  token: string;
};
export type TwoFactorRecoveryCodeFormMutation$data = {
  readonly verify2faWithRecoveryCode: {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
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
  "name": "captchaToken"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "token"
},
v2 = [
  {
    "kind": "Variable",
    "name": "captchaToken",
    "variableName": "captchaToken"
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
  "type": "InvalidCaptchaTokenError",
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
    "cacheID": "7db547f61edc02d530266eae6813d576",
    "id": null,
    "metadata": {},
    "name": "TwoFactorRecoveryCodeFormMutation",
    "operationKind": "mutation",
    "text": "mutation TwoFactorRecoveryCodeFormMutation($token:String!,$captchaToken:String!){verify2faWithRecoveryCode(token:$token,captchaToken:$captchaToken){__typename,...on TwoFactorAuthenticationChallengeNotFoundError{message},...on InvalidCaptchaTokenError{message},...on TwoFactorAuthenticationNotEnabledError{message},...on InvalidCredentialsError{message},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "3e6ed90ab60883b2e8b5e7467a122829";

export default node;
