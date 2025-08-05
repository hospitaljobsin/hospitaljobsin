/**
 * @generated SignedSource<<d16394527f5f5b926ff240c20734aa36>>
 * @relayHash ffcb5b65cd650aaa67cc78c8a097749d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ffcb5b65cd650aaa67cc78c8a097749d

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationFormBannerPresignedUrlMutation$variables = {
  contentType: string;
};
export type UpdateOrganizationFormBannerPresignedUrlMutation$data = {
  readonly createOrganizationBannerPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type UpdateOrganizationFormBannerPresignedUrlMutation = {
  response: UpdateOrganizationFormBannerPresignedUrlMutation$data;
  variables: UpdateOrganizationFormBannerPresignedUrlMutation$variables;
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
    "concreteType": "CreatePresignedURLPayloadType",
    "kind": "LinkedField",
    "name": "createOrganizationBannerPresignedUrl",
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
    "name": "UpdateOrganizationFormBannerPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateOrganizationFormBannerPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "ffcb5b65cd650aaa67cc78c8a097749d",
    "metadata": {},
    "name": "UpdateOrganizationFormBannerPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "ea4c5dce183c74d2b8731ce2608a0d5d";

export default node;
