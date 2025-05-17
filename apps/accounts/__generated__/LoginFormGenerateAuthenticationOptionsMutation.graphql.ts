/**
 * @generated SignedSource<<6ea40b8cfc0251fb459eaaf3b00b8da7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LoginFormGenerateAuthenticationOptionsMutation$variables = {
  recaptchaToken: string;
};
export type LoginFormGenerateAuthenticationOptionsMutation$data = {
  readonly generateAuthenticationOptions: {
    readonly __typename: "GenerateAuthenticationOptionsSuccess";
    readonly authenticationOptions: any;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
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
    "name": "recaptchaToken"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "recaptchaToken",
        "variableName": "recaptchaToken"
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
        "type": "InvalidRecaptchaTokenError",
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
    "cacheID": "2a7d9ec45713a367b1dbc71b0b7de683",
    "id": null,
    "metadata": {},
    "name": "LoginFormGenerateAuthenticationOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormGenerateAuthenticationOptionsMutation(\n  $recaptchaToken: String!\n) {\n  generateAuthenticationOptions(recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on GenerateAuthenticationOptionsSuccess {\n      authenticationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ef1f9ce5f4ff0183bac4d3dd79be8240";

export default node;
