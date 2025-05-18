/**
 * @generated SignedSource<<64b634eccb1e24887751b16466cff2bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LoginFormGenerateAuthenticationOptionsMutation$variables = {
  captchaToken: string;
};
export type LoginFormGenerateAuthenticationOptionsMutation$data = {
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
export type LoginFormGenerateAuthenticationOptionsMutation = {
  response: LoginFormGenerateAuthenticationOptionsMutation$data;
  variables: LoginFormGenerateAuthenticationOptionsMutation$variables;
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
    "name": "LoginFormGenerateAuthenticationOptionsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoginFormGenerateAuthenticationOptionsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "68830faa3e9826b9fa2f619a60a5c93a",
    "id": null,
    "metadata": {},
    "name": "LoginFormGenerateAuthenticationOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormGenerateAuthenticationOptionsMutation($captchaToken:String!){generateAuthenticationOptions(captchaToken:$captchaToken){__typename,...on InvalidCaptchaTokenError{message},...on GenerateAuthenticationOptionsSuccess{authenticationOptions}}}"
  }
};
})();

(node as any).hash = "810d3e34440e7b40adf0f66a7ea589d6";

export default node;
