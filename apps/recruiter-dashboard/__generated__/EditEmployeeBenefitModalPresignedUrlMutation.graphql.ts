/**
 * @generated SignedSource<<98a122eafc7bd4017548a5e0a270a798>>
 * @relayHash 04f90cda0d8a223470797200f28bd13a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 04f90cda0d8a223470797200f28bd13a

import type { ConcreteRequest } from 'relay-runtime';
export type EditEmployeeBenefitModalPresignedUrlMutation$variables = {
  contentType: string;
};
export type EditEmployeeBenefitModalPresignedUrlMutation$data = {
  readonly createEmployeeBenefitPosterPresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type EditEmployeeBenefitModalPresignedUrlMutation = {
  response: EditEmployeeBenefitModalPresignedUrlMutation$data;
  variables: EditEmployeeBenefitModalPresignedUrlMutation$variables;
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
    "name": "EditEmployeeBenefitModalPresignedUrlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditEmployeeBenefitModalPresignedUrlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "04f90cda0d8a223470797200f28bd13a",
    "metadata": {},
    "name": "EditEmployeeBenefitModalPresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "741c2fedaf28ec3f888e4d58cca4018f";

export default node;
