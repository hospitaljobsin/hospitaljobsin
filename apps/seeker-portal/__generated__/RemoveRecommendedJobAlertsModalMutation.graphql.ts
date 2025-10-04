/**
 * @generated SignedSource<<1e6e530b44b65c31632c12c7c01d7ec9>>
 * @relayHash eac490e80134ad86fe7598d7f9e735d3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID eac490e80134ad86fe7598d7f9e735d3

import type { ConcreteRequest } from 'relay-runtime';
export type RemoveRecommendedJobAlertsModalMutation$variables = Record<PropertyKey, never>;
export type RemoveRecommendedJobAlertsModalMutation$data = {
  readonly removeRecommendedJobAlerts: {
    readonly __typename: "Account";
    readonly id: string;
  } | {
    readonly __typename: "RecommendedJobAlertsNotFoundError";
    readonly message: string;
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
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": (v1/*: any*/),
  "type": "Account",
  "abstractKey": null
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
    "argumentDefinitions": [],
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
          (v0/*: any*/),
          (v2/*: any*/),
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
    "argumentDefinitions": [],
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
          (v0/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": (v1/*: any*/),
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "eac490e80134ad86fe7598d7f9e735d3",
    "metadata": {},
    "name": "RemoveRecommendedJobAlertsModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "5a88619318cb95e345b89e2797e4824a";

export default node;
