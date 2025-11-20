/**
 * @generated SignedSource<<bb1d88823bce43e066bba726c4b1983d>>
 * @relayHash c37ef763dce98911104d89c4649d9c2d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c37ef763dce98911104d89c4649d9c2d

import type { ConcreteRequest } from 'relay-runtime';
export type CreateEmployeeBenefitModalPresignedUrlMutation$variables = {
  contentType: string;
};
export type CreateEmployeeBenefitModalPresignedUrlMutation$data = {
  readonly createEmployeeBenefitPosterPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type CreateEmployeeBenefitModalPresignedUrlMutation = {
  response: CreateEmployeeBenefitModalPresignedUrlMutation$data;
  variables: CreateEmployeeBenefitModalPresignedUrlMutation$variables;
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
    "name": "createEmployeeBenefitPosterPresignedUrl",
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
    "name": "CreateEmployeeBenefitModalPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateEmployeeBenefitModalPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "c37ef763dce98911104d89c4649d9c2d",
    "metadata": {},
    "name": "CreateEmployeeBenefitModalPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "a6bf1122df39cad9a721ecb996bfa63e";

export default node;
