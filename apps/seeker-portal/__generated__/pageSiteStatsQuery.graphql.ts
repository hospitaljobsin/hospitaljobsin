/**
 * @generated SignedSource<<91d9ad5c1e4f52fa7e628b6aa6a38ce7>>
 * @relayHash ee9baba018108f629e95114ea89256fe
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ee9baba018108f629e95114ea89256fe

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSiteStatsQuery$variables = Record<PropertyKey, never>;
export type pageSiteStatsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SiteStatsFragment">;
};
export type pageSiteStatsQuery = {
  response: pageSiteStatsQuery$data;
  variables: pageSiteStatsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Stats",
    "kind": "LinkedField",
    "name": "stats",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalJobs",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalVacancies",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalOrganizations",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSiteStatsQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "SiteStatsFragment",
        "selections": (v0/*: any*/),
        "args": null,
        "argumentDefinitions": []
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageSiteStatsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "ee9baba018108f629e95114ea89256fe",
    "metadata": {},
    "name": "pageSiteStatsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "5f46d98a6e451c17c766c5c77a49fe85";

export default node;
