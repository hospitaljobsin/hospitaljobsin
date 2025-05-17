/**
 * @generated SignedSource<<f1e124b61fb9593a897a1037b5136db5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyRegistrationOptionsMutation$variables = {
  captchaToken: string;
  email: string;
  fullName: string;
};
export type PasskeyRegistrationOptionsMutation$data = {
  readonly generatePasskeyRegistrationOptions: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "GeneratePasskeyRegistrationOptionsSuccess";
    readonly registrationOptions: any;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PasskeyRegistrationOptionsMutation = {
  response: PasskeyRegistrationOptionsMutation$data;
  variables: PasskeyRegistrationOptionsMutation$variables;
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
  "name": "email"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fullName"
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "captchaToken",
        "variableName": "captchaToken"
      },
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "fullName",
        "variableName": "fullName"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "generatePasskeyRegistrationOptions",
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
        "selections": (v3/*: any*/),
        "type": "EmailInUseError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
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
            "name": "registrationOptions",
            "storageKey": null
          }
        ],
        "type": "GeneratePasskeyRegistrationOptionsSuccess",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PasskeyRegistrationOptionsMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PasskeyRegistrationOptionsMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "4d1ae4f29eadf8cb2858a9de91afe786",
    "id": null,
    "metadata": {},
    "name": "PasskeyRegistrationOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyRegistrationOptionsMutation(\n  $email: String!\n  $fullName: String!\n  $captchaToken: String!\n) {\n  generatePasskeyRegistrationOptions(email: $email, fullName: $fullName, captchaToken: $captchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on GeneratePasskeyRegistrationOptionsSuccess {\n      registrationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "bb4ca2e6374affc04fb89d62e8a398f3";

export default node;
