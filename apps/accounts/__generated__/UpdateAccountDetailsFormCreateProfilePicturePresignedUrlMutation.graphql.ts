/**
 * @generated SignedSource<<741a06484f0b7d89c6cb15c82b62f753>>
 * @relayHash 79f85f97941e0fec2639cbb21c1f9180
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 79f85f97941e0fec2639cbb21c1f9180

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation$variables = {
  contentType: string;
};
export type UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation$data = {
  readonly createProfilePicturePresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation = {
  response: UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation$data;
  variables: UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation$variables;
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
    "concreteType": "CreateProfilePicturePresignedURLPayload",
    "kind": "LinkedField",
    "name": "createProfilePicturePresignedUrl",
    "plural": false,
    "selections": [
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
    "name": "UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "79f85f97941e0fec2639cbb21c1f9180",
    "metadata": {},
    "name": "UpdateAccountDetailsFormCreateProfilePicturePresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "3108432f9c41e3fd174df198d85df973";

export default node;
