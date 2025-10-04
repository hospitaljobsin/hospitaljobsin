/**
 * @generated SignedSource<<b38f179b44bb6adca62ca8cd0760d168>>
 * @relayHash 8c1c0161054b87c8ba83f22046c56029
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8c1c0161054b87c8ba83f22046c56029

import type { ConcreteRequest } from 'relay-runtime';
export type RemoveRecommendedJobAlertsModalMutation$variables = {
  connections: ReadonlyArray<string>;
};
export type RemoveRecommendedJobAlertsModalMutation$data = {
  readonly removeRecommendedJobAlerts: {
    readonly __typename: "RecommendedJobAlertsNotFoundError";
    readonly message: string;
  } | {
    readonly __typename: "RemoveRecommendedJobAlertsSuccess";
    readonly removedRecommendedJobAlertIds: ReadonlyArray<string>;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type RemoveRecommendedJobAlertsModalMutation = {
  response: RemoveRecommendedJobAlertsModalMutation$data;
  variables: RemoveRecommendedJobAlertsModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "removedRecommendedJobAlertIds",
  "storageKey": null
},
v3 = {
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
  "type": "RecommendedJobAlertsNotFoundError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveRecommendedJobAlertsModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeRecommendedJobAlerts",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/)
            ],
            "type": "RemoveRecommendedJobAlertsSuccess",
            "abstractKey": null
          },
          (v3/*: any*/)
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
    "name": "RemoveRecommendedJobAlertsModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeRecommendedJobAlerts",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "deleteEdge",
                "key": "",
                "kind": "ScalarHandle",
                "name": "removedRecommendedJobAlertIds",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "connections"
                  }
                ]
              }
            ],
            "type": "RemoveRecommendedJobAlertsSuccess",
            "abstractKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "8c1c0161054b87c8ba83f22046c56029",
    "metadata": {},
    "name": "RemoveRecommendedJobAlertsModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "e0b30961f15c869b15b2dc9e84fd7e51";

export default node;
