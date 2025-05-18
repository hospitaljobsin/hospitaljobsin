/**
 * @generated SignedSource<<be0b13bf6367e4e7bf4a1527e5432c31>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationFormLogoPresignedUrlMutation$variables = Record<PropertyKey, never>;
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
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "eacf1df433abd6d22600030433f68ef7",
    "id": null,
    "metadata": {},
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateOrganizationFormLogoPresignedUrlMutation{createOrganizationLogoPresignedUrl{presignedUrl}}"
  }
};
})();

(node as any).hash = "8da9a02fa5b72be5379337e09f6e39f1";

export default node;
