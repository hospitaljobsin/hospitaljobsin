/**
 * @generated SignedSource<<5c9fd3f63ba9c11e073b31b2d068cc9a>>
 * @relayHash a557a71d43a00bbd1984f4aa1e78091e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a557a71d43a00bbd1984f4aa1e78091e

import type { ConcreteRequest } from 'relay-runtime';
export type AutofillWithAIModalGeneratePresignedURLMutation$variables = {
  contentType: string;
};
export type AutofillWithAIModalGeneratePresignedURLMutation$data = {
  readonly generateProfileDocumentPresignedUrl: {
    readonly fileKey: string;
    readonly presignedUrl: string;
  };
};
export type AutofillWithAIModalGeneratePresignedURLMutation = {
  response: AutofillWithAIModalGeneratePresignedURLMutation$data;
  variables: AutofillWithAIModalGeneratePresignedURLMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "contentType"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "contentType",
        "variableName": "contentType"
      }
    ],
    "concreteType": "GenerateProfileDocumentPresignedURLPayload",
    "kind": "LinkedField",
    "name": "generateProfileDocumentPresignedUrl",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "presignedUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fileKey",
        "storageKey": null
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
    "name": "AutofillWithAIModalGeneratePresignedURLMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AutofillWithAIModalGeneratePresignedURLMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "a557a71d43a00bbd1984f4aa1e78091e",
    "metadata": {},
    "name": "AutofillWithAIModalGeneratePresignedURLMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d42fbef98a42b85d6764a2982d478915";

export default node;
