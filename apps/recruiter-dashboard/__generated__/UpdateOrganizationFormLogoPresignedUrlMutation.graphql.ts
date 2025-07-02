/**
 * @generated SignedSource<<4c56924022948b6e53f2cb2344d8a072>>
 * @relayHash 6a3806ceb80b0b9defaebdcf4165e778
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6a3806ceb80b0b9defaebdcf4165e778

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationFormLogoPresignedUrlMutation$variables = {
  contentType: string;
};
export type UpdateOrganizationFormLogoPresignedUrlMutation$data = {
  readonly createOrganizationLogoPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type UpdateOrganizationFormLogoPresignedUrlMutation = {
  response: UpdateOrganizationFormLogoPresignedUrlMutation$data;
  variables: UpdateOrganizationFormLogoPresignedUrlMutation$variables;
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
    "concreteType": "CreateOrganizationLogoPresignedURLPayload",
    "kind": "LinkedField",
    "name": "createOrganizationLogoPresignedUrl",
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
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "6a3806ceb80b0b9defaebdcf4165e778",
    "metadata": {},
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "9b2921240b830ccfa77ac1088dc6fe23";

export default node;
