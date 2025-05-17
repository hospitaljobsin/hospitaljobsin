/**
 * @generated SignedSource<<cc95453890e9d04a246bc49737df275f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeysControllerGenerateOptionsMutation$variables = Record<PropertyKey, never>;
export type PasskeysControllerGenerateOptionsMutation$data = {
  readonly generateWebAuthnCredentialCreationOptions: {
    readonly registrationOptions?: any;
  };
};
export type PasskeysControllerGenerateOptionsMutation = {
  response: PasskeysControllerGenerateOptionsMutation$data;
  variables: PasskeysControllerGenerateOptionsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
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
  "type": "GeneratePasskeyCreationOptionsSuccess",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PasskeysControllerGenerateOptionsMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "generateWebAuthnCredentialCreationOptions",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PasskeysControllerGenerateOptionsMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "generateWebAuthnCredentialCreationOptions",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9da99709923eaea58f8529c64fe6f759",
    "id": null,
    "metadata": {},
    "name": "PasskeysControllerGenerateOptionsMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeysControllerGenerateOptionsMutation {\n  generateWebAuthnCredentialCreationOptions {\n    __typename\n    ... on GeneratePasskeyCreationOptionsSuccess {\n      registrationOptions\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fdbb2a7254cca153785882e5ba4b9ac1";

export default node;
