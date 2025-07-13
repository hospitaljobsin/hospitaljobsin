/**
 * @generated SignedSource<<3a6b2f0270bbcbb8b7fd75b46ff0ed48>>
 * @relayHash 997c68315e33b143ebc92572544d459a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 997c68315e33b143ebc92572544d459a

import type { ConcreteRequest } from 'relay-runtime';
export type AutofillWithAISectionGeneratePresignedURLMutation$variables = {
  contentType: string;
};
export type AutofillWithAISectionGeneratePresignedURLMutation$data = {
  readonly generateProfileDocumentPresignedUrl: {
    readonly fileKey: string;
    readonly presignedUrl: string;
  };
};
export type AutofillWithAISectionGeneratePresignedURLMutation = {
  response: AutofillWithAISectionGeneratePresignedURLMutation$data;
  variables: AutofillWithAISectionGeneratePresignedURLMutation$variables;
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
    "name": "AutofillWithAISectionGeneratePresignedURLMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AutofillWithAISectionGeneratePresignedURLMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "997c68315e33b143ebc92572544d459a",
    "metadata": {},
    "name": "AutofillWithAISectionGeneratePresignedURLMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "3632cae2733599f68eb64c2524e17d14";

export default node;
