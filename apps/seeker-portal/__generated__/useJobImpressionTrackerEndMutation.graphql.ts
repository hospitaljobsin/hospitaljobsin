/**
 * @generated SignedSource<<b4b2a3941180516761a0c5f44583941d>>
 * @relayHash 61866794fd4b41f06fe69c6c67709dc3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 61866794fd4b41f06fe69c6c67709dc3

import type { ConcreteRequest } from 'relay-runtime';
export type useJobImpressionTrackerEndMutation$variables = {
  impressionId: string;
  jobId: string;
};
export type useJobImpressionTrackerEndMutation$data = {
  readonly logJobViewEnd: {
    readonly __typename: "LogJobViewPayload";
  };
};
export type useJobImpressionTrackerEndMutation = {
  response: useJobImpressionTrackerEndMutation$data;
  variables: useJobImpressionTrackerEndMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "impressionId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "jobId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "impressionId",
        "variableName": "impressionId"
      },
      {
        "kind": "Variable",
        "name": "jobId",
        "variableName": "jobId"
      }
    ],
    "concreteType": "LogJobViewPayload",
    "kind": "LinkedField",
    "name": "logJobViewEnd",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
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
    "name": "useJobImpressionTrackerEndMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useJobImpressionTrackerEndMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "61866794fd4b41f06fe69c6c67709dc3",
    "metadata": {},
    "name": "useJobImpressionTrackerEndMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "b1dc8372cae1a1bd81eb18823967c46e";

export default node;
