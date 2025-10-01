/**
 * @generated SignedSource<<070c8fdb77ec6772dbf73526860b35c4>>
 * @relayHash 0ff1924448f8d76cde2b3c12803abd24
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0ff1924448f8d76cde2b3c12803abd24

import type { ConcreteRequest } from 'relay-runtime';
export type ResumeUploadStepGeneratePresignedUrlMutation$variables = {
  contentType: string;
};
export type ResumeUploadStepGeneratePresignedUrlMutation$data = {
  readonly generateProfileDocumentPresignedUrl: {
    readonly fileKey: string;
    readonly presignedUrl: string;
  };
};
export type ResumeUploadStepGeneratePresignedUrlMutation = {
  response: ResumeUploadStepGeneratePresignedUrlMutation$data;
  variables: ResumeUploadStepGeneratePresignedUrlMutation$variables;
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
    "name": "ResumeUploadStepGeneratePresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResumeUploadStepGeneratePresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "0ff1924448f8d76cde2b3c12803abd24",
    "metadata": {},
    "name": "ResumeUploadStepGeneratePresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "36d9ba10015f1fd89704c822acdcf310";

export default node;
