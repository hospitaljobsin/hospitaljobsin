/**
 * @generated SignedSource<<cf7d9b5cf4329e4e04088bcffaaebd07>>
 * @relayHash fba8da6c0175edd2e9f5b149727372eb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID fba8da6c0175edd2e9f5b149727372eb

import type { ConcreteRequest } from 'relay-runtime';
export type RequestVerificationFormPresignedUrlMutation$variables = {
  contentType: string;
};
export type RequestVerificationFormPresignedUrlMutation$data = {
  readonly createOrganizationVerificationProofPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type RequestVerificationFormPresignedUrlMutation = {
  response: RequestVerificationFormPresignedUrlMutation$data;
  variables: RequestVerificationFormPresignedUrlMutation$variables;
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
    "name": "createOrganizationVerificationProofPresignedUrl",
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
    "name": "RequestVerificationFormPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RequestVerificationFormPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "fba8da6c0175edd2e9f5b149727372eb",
    "metadata": {},
    "name": "RequestVerificationFormPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "2c037fcfb13fa8bf7ee48e1f0de428c7";

export default node;
