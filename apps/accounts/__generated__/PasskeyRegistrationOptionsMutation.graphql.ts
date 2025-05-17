/**
 * @generated SignedSource<<b7aca6cefd67b69a234c92a44ccf5d9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyRegistrationOptionsMutation$variables = {
  email: string;
  fullName: string;
  recaptchaToken: string;
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fullName"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recaptchaToken"
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "fullName",
        "variableName": "fullName"
      },
      {
        "kind": "Variable",
        "name": "recaptchaToken",
        "variableName": "recaptchaToken"
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
        "selections": (v1/*: any*/),
        "type": "EmailInUseError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PasskeyRegistrationOptionsMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PasskeyRegistrationOptionsMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "5d46d68afdc2500c00261deed66f1762",
    "id": null,
    "metadata": {},
    "name": "PasskeyRegistrationOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyRegistrationOptionsMutation(\n  $email: String!\n  $fullName: String!\n  $recaptchaToken: String!\n) {\n  generatePasskeyRegistrationOptions(email: $email, fullName: $fullName, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on GeneratePasskeyRegistrationOptionsSuccess {\n      registrationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d6cb1fa4e921364f53729fc6f046432d";

export default node;
