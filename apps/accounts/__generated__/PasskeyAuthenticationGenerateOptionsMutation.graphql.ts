/**
 * @generated SignedSource<<3763b7a906f4219104f3d4048e55864d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type PasskeyAuthenticationGenerateOptionsMutation$variables = {
  captchaToken: string;
};
export type PasskeyAuthenticationGenerateOptionsMutation$data = {
  readonly generateReauthenticationOptions: {
    readonly __typename: "GenerateAuthenticationOptionsSuccess";
    readonly authenticationOptions: any;
  } | {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PasskeyAuthenticationGenerateOptionsMutation = {
  response: PasskeyAuthenticationGenerateOptionsMutation$data;
  variables: PasskeyAuthenticationGenerateOptionsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "captchaToken"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "captchaToken",
        "variableName": "captchaToken"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "generateReauthenticationOptions",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "message",
            "storageKey": null
          }
        ],
        "type": "InvalidCaptchaTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "authenticationOptions",
            "storageKey": null
          }
        ],
        "type": "GenerateAuthenticationOptionsSuccess",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PasskeyAuthenticationGenerateOptionsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PasskeyAuthenticationGenerateOptionsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5ac9c264f736153470f410990e142cf9",
    "id": null,
    "metadata": {},
    "name": "PasskeyAuthenticationGenerateOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyAuthenticationGenerateOptionsMutation($captchaToken:String!){generateReauthenticationOptions(captchaToken:$captchaToken){__typename,...on InvalidCaptchaTokenError{message},...on GenerateAuthenticationOptionsSuccess{authenticationOptions}}}"
  }
};
})();

(node as any).hash = "5bad14f59f9d01d8ef606eea5f3f8a54";

export default node;
