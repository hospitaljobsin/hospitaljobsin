/**
 * @generated SignedSource<<2b6ef5cbd4b7a4c6840a3ee139010421>>
 * @relayHash 9e0f3bc5149ea2b7ddac06a9d0304a1d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9e0f3bc5149ea2b7ddac06a9d0304a1d

import type { ConcreteRequest } from 'relay-runtime';
export type useJobImpressionTrackerStartMutation$variables = {
  impressionId: string;
  jobId: string;
};
export type useJobImpressionTrackerStartMutation$data = {
  readonly logJobViewStart: {
    readonly __typename: "LogJobViewPayload";
  };
};
export type useJobImpressionTrackerStartMutation = {
  response: useJobImpressionTrackerStartMutation$data;
  variables: useJobImpressionTrackerStartMutation$variables;
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
    "name": "logJobViewStart",
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
    "name": "useJobImpressionTrackerStartMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useJobImpressionTrackerStartMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "9e0f3bc5149ea2b7ddac06a9d0304a1d",
    "metadata": {},
    "name": "useJobImpressionTrackerStartMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "7f72a723ced98b9aa65565953d6397de";

export default node;
