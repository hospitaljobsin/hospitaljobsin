/**
 * @generated SignedSource<<134dafb47795ce39b78e68a268eef836>>
 * @relayHash 55d7dd36050e849d80438fe23e09742d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 55d7dd36050e849d80438fe23e09742d

import type { ConcreteRequest } from 'relay-runtime';
export type JobAlertControlsDeleteMutation$variables = {
  jobAlertId: string;
};
export type JobAlertControlsDeleteMutation$data = {
  readonly deleteJobAlert: {
    readonly __typename: "JobAlert";
    readonly id: string;
  } | {
    readonly __typename: "JobAlertNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type JobAlertControlsDeleteMutation = {
  response: JobAlertControlsDeleteMutation$data;
  variables: JobAlertControlsDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "jobAlertId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "jobAlertId",
    "variableName": "jobAlertId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  }
],
v4 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "JobAlert",
  "abstractKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "JobAlertNotFoundError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "JobAlertControlsDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteJobAlert",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "JobAlertControlsDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteJobAlert",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": (v3/*: any*/),
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "55d7dd36050e849d80438fe23e09742d",
    "metadata": {},
    "name": "JobAlertControlsDeleteMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "358fb48d9a83510f9d2ce4dce12f9262";

export default node;
