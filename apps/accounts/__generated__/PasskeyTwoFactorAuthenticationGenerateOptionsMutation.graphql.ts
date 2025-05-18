/**
 * @generated SignedSource<<6513dfa01ec098765ceacf33722244f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation$variables = {
  captchaToken: string;
};
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation$data = {
  readonly generateAuthenticationOptions: {
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
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation = {
  response: PasskeyTwoFactorAuthenticationGenerateOptionsMutation$data;
  variables: PasskeyTwoFactorAuthenticationGenerateOptionsMutation$variables;
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
    "name": "generateAuthenticationOptions",
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
    "name": "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "abfbc91d39966d26ab1d7a700ad8afcc",
    "id": null,
    "metadata": {},
    "name": "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyTwoFactorAuthenticationGenerateOptionsMutation($captchaToken:String!){generateAuthenticationOptions(captchaToken:$captchaToken){__typename,...on InvalidCaptchaTokenError{message},...on GenerateAuthenticationOptionsSuccess{authenticationOptions}}}"
  }
};
})();

(node as any).hash = "439ee9c9c359679af149d1042ec8185c";

export default node;
