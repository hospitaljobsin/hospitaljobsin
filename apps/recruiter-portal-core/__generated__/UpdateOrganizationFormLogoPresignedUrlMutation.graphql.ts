/**
 * @generated SignedSource<<ade35785fcabebcc2e87f1e4142bc727>>
 * @relayHash eacf1df433abd6d22600030433f68ef7
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID eacf1df433abd6d22600030433f68ef7

import type { ConcreteRequest } from 'relay-runtime';
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
    "id": "eacf1df433abd6d22600030433f68ef7",
    "metadata": {},
    "name": "UpdateOrganizationFormLogoPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "8da9a02fa5b72be5379337e09f6e39f1";

export default node;
