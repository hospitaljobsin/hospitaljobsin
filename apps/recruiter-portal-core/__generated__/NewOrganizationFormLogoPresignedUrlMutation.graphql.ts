/**
 * @generated SignedSource<<6e496aed3485ec1a72ce0e0f4fb8a719>>
 * @relayHash 29eab4413c02445765c0f7c89de8df34
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 29eab4413c02445765c0f7c89de8df34

import type { ConcreteRequest } from 'relay-runtime';
export type NewOrganizationFormLogoPresignedUrlMutation$variables = {
  contentType: string;
};
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
    "name": "NewOrganizationFormLogoPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NewOrganizationFormLogoPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "29eab4413c02445765c0f7c89de8df34",
    "metadata": {},
    "name": "NewOrganizationFormLogoPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "05e8b71e4325252afa94ed14abb97626";

export default node;
