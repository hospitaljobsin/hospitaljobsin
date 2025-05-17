/**
 * @generated SignedSource<<348a1892ea1495c0f07b9ab3c30388f3>>
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
    readonly __typename: "InvalidRecaptchaTokenError";
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
    "cacheID": "422cc388d7b20cac275bdd072bf986e3",
    "id": null,
    "metadata": {},
    "name": "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyTwoFactorAuthenticationGenerateOptionsMutation(\n  $captchaToken: String!\n) {\n  generateAuthenticationOptions(captchaToken: $captchaToken) {\n    __typename\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on GenerateAuthenticationOptionsSuccess {\n      authenticationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "40d234bce8500a6f05789054769f02e2";

export default node;
