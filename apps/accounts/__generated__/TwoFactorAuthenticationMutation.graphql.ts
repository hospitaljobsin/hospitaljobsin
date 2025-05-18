/**
 * @generated SignedSource<<796b08638faae1b043f6b1352d579c4f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TwoFactorAuthenticationMutation$variables = {
  captchaToken: string;
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
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
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
  "name": "captchaToken"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "twoFactorToken"
},
v2 = [
  {
    "kind": "Variable",
    "name": "captchaToken",
    "variableName": "captchaToken"
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
  "type": "InvalidCaptchaTokenError",
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
    "cacheID": "f41a195fd7065de4476aae93444029b1",
    "id": null,
    "metadata": {},
    "name": "TwoFactorAuthenticationMutation",
    "operationKind": "mutation",
    "text": "mutation TwoFactorAuthenticationMutation($twoFactorToken:String!,$captchaToken:String!){requestSudoModeWithAuthenticator(twoFactorToken:$twoFactorToken,captchaToken:$captchaToken){__typename,...on Account{__typename},...on InvalidCredentialsError{message},...on InvalidCaptchaTokenError{message},...on AuthenticatorNotEnabledError{message},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "3cbd0f792c7d3825c1a0bfc91b70028e";

export default node;
