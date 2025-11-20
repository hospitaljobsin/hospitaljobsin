/**
 * @generated SignedSource<<1a74111f054d9817efa9b39747ce94eb>>
 * @relayHash 31e643dcd6267503623a6d8f20d90aba
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 31e643dcd6267503623a6d8f20d90aba

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationFormHomePageBannerPresignedUrlMutation$variables = {
  contentType: string;
};
export type UpdateOrganizationFormHomePageBannerPresignedUrlMutation$data = {
  readonly createOrganizationHomePageBannerPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type UpdateOrganizationFormHomePageBannerPresignedUrlMutation = {
  response: UpdateOrganizationFormHomePageBannerPresignedUrlMutation$data;
  variables: UpdateOrganizationFormHomePageBannerPresignedUrlMutation$variables;
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
    "name": "createOrganizationHomePageBannerPresignedUrl",
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
    "name": "UpdateOrganizationFormHomePageBannerPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateOrganizationFormHomePageBannerPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "31e643dcd6267503623a6d8f20d90aba",
    "metadata": {},
    "name": "UpdateOrganizationFormHomePageBannerPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "66f5858297f8186680098c21786e1377";

export default node;
