/**
 * @generated SignedSource<<9f90b72cc82097a1061690ca4236a831>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyAuthenticationGenerateOptionsMutation$variables = {
  recaptchaToken: string;
};
export type PasskeyAuthenticationGenerateOptionsMutation$data = {
  readonly generateReauthenticationOptions: {
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
export type PasskeyAuthenticationGenerateOptionsMutation = {
  response: PasskeyAuthenticationGenerateOptionsMutation$data;
  variables: PasskeyAuthenticationGenerateOptionsMutation$variables;
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
    "cacheID": "84bdea7010eb83292346ea27c8fd0cb8",
    "id": null,
    "metadata": {},
    "name": "PasskeyAuthenticationGenerateOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyAuthenticationGenerateOptionsMutation(\n  $recaptchaToken: String!\n) {\n  generateReauthenticationOptions(recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on GenerateAuthenticationOptionsSuccess {\n      authenticationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ab85d82334ab1f926f6252ff98dbaf4e";

export default node;
