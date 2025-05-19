/**
 * @generated SignedSource<<18f32307316693634d4bdcb04a1e0045>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type NewOrganizationFormLogoPresignedUrlMutation$variables = Record<PropertyKey, never>;
export type NewOrganizationFormLogoPresignedUrlMutation$data = {
  readonly createOrganizationLogoPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type NewOrganizationFormLogoPresignedUrlMutation = {
  response: NewOrganizationFormLogoPresignedUrlMutation$data;
  variables: NewOrganizationFormLogoPresignedUrlMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewOrganizationFormLogoPresignedUrlMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "NewOrganizationFormLogoPresignedUrlMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ae88f5a902d57fef7033d9c774a5dbe9",
    "id": null,
    "metadata": {},
    "name": "NewOrganizationFormLogoPresignedUrlMutation",
    "operationKind": "mutation",
    "text": "mutation NewOrganizationFormLogoPresignedUrlMutation{createOrganizationLogoPresignedUrl{presignedUrl}}"
  }
};
})();

(node as any).hash = "0782081a5faf06a424f5f4651b85a745";

export default node;
