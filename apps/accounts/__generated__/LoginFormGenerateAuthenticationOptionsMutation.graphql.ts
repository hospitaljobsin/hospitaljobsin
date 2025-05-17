/**
 * @generated SignedSource<<6752c85fc201ee3ccd0fc705a0efdcd5>>
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
    "cacheID": "18d3739f0e9c13039e1dc0bfc26c7ccf",
    "id": null,
    "metadata": {},
    "name": "LoginFormGenerateAuthenticationOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormGenerateAuthenticationOptionsMutation(\n  $captchaToken: String!\n) {\n  generateAuthenticationOptions(captchaToken: $captchaToken) {\n    __typename\n    ... on InvalidCaptchaTokenError {\n      message\n    }\n    ... on GenerateAuthenticationOptionsSuccess {\n      authenticationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "810d3e34440e7b40adf0f66a7ea589d6";

export default node;
