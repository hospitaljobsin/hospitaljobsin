/**
 * @generated SignedSource<<66433478fb186ea6a44da772714ccd30>>
 * @relayHash d473bdb29c6a5b0b4eaff833f51e101c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d473bdb29c6a5b0b4eaff833f51e101c

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation$variables = {
  contentType: string;
};
export type UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation$data = {
  readonly generateProfileDocumentPresignedUrl: {
    readonly fileKey: string;
    readonly presignedUrl: string;
  };
};
export type UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation = {
  response: UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation$data;
  variables: UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation$variables;
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
        "name": "fileKey",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "presignedUrl",
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
    "name": "UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "d473bdb29c6a5b0b4eaff833f51e101c",
    "metadata": {},
    "name": "UpdateResumeFormGenerateProfileDocumentPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "f9c148e5da1cf6eadd7dc40c9159e670";

export default node;
