/**
 * @generated SignedSource<<9bcb871532f6377b1e2abcdb624e9945>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation$variables = {
  recaptchaToken: string;
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
    "cacheID": "fb6df2b59723cc803ccd275fca24dfd1",
    "id": null,
    "metadata": {},
    "name": "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyTwoFactorAuthenticationGenerateOptionsMutation(\n  $recaptchaToken: String!\n) {\n  generateAuthenticationOptions(recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on GenerateAuthenticationOptionsSuccess {\n      authenticationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "06e694456d7c053db97612068241cb41";

export default node;
