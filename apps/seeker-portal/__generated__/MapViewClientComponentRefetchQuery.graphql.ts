/**
 * @generated SignedSource<<fabd3570ccd102742aa5752a33be13b3>>
 * @relayHash e2b1d154c84b95eba095b9b134a6dbee
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e2b1d154c84b95eba095b9b134a6dbee

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type BoundingBoxInput = {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
};
export type MapViewClientComponentRefetchQuery$variables = {
  bounds: BoundingBoxInput;
  inputJobType: ReadonlyArray<JobTypeFilter>;
  inputLocation?: string | null | undefined;
  inputMaxSalary?: number | null | undefined;
  inputMinExperience?: number | null | undefined;
  inputMinSalary?: number | null | undefined;
  inputProximityKm?: number | null | undefined;
  inputSearchTerm?: string | null | undefined;
  inputSortBy: JobSearchSortBy;
  inputWorkMode: ReadonlyArray<JobWorkModeFilter>;
  inputZoomLevel: number;
};
export type MapViewClientComponentRefetchQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MapViewClientComponentFragment">;
};
export type MapViewClientComponentRefetchQuery = {
  response: MapViewClientComponentRefetchQuery$data;
  variables: MapViewClientComponentRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "bounds"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputJobType"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputLocation"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputMaxSalary"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputMinExperience"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputMinSalary"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputProximityKm"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputSearchTerm"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputSortBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputWorkMode"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputZoomLevel"
  }
],
v1 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "inputJobType"
},
v2 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "inputLocation"
},
v3 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "inputMaxSalary"
},
v4 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "inputMinExperience"
},
v5 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "inputMinSalary"
},
v6 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "inputProximityKm"
},
v7 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "inputSearchTerm"
},
v8 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "inputWorkMode"
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MapViewClientComponentRefetchQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "inputJobType",
            "variableName": "inputJobType"
          },
          {
            "kind": "Variable",
            "name": "inputLocation",
            "variableName": "inputLocation"
          },
          {
            "kind": "Variable",
            "name": "inputMaxSalary",
            "variableName": "inputMaxSalary"
          },
          {
            "kind": "Variable",
            "name": "inputMinExperience",
            "variableName": "inputMinExperience"
          },
          {
            "kind": "Variable",
            "name": "inputMinSalary",
            "variableName": "inputMinSalary"
          },
          {
            "kind": "Variable",
            "name": "inputProximityKm",
            "variableName": "inputProximityKm"
          },
          {
            "kind": "Variable",
            "name": "inputSearchTerm",
            "variableName": "inputSearchTerm"
          },
          {
            "kind": "Variable",
            "name": "inputSortBy",
            "variableName": "inputSortBy"
          },
          {
            "kind": "Variable",
            "name": "inputWorkMode",
            "variableName": "inputWorkMode"
          },
          {
            "kind": "Variable",
            "name": "inputZoomLevel",
            "variableName": "inputZoomLevel"
          }
        ],
        "kind": "FragmentSpread",
        "name": "MapViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MapViewClientComponentRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "bounds",
            "variableName": "bounds"
          },
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "kind": "Variable",
            "name": "zoomLevel",
            "variableName": "inputZoomLevel"
          }
        ],
        "concreteType": "JobClusterConnection",
        "kind": "LinkedField",
        "name": "jobClusters",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "JobCluster",
            "kind": "LinkedField",
            "name": "clusters",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "h3Index",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "count",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "GeoObject",
                "kind": "LinkedField",
                "name": "center",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "coordinates",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "bounds",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v10/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 100
          },
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "kind": "Variable",
            "name": "sortBy",
            "variableName": "inputSortBy"
          },
          (v8/*: any*/)
        ],
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": false,
        "selections": [
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e2b1d154c84b95eba095b9b134a6dbee",
    "metadata": {},
    "name": "MapViewClientComponentRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "1346aef84d4db284c4ff0f0f9fa3618a";

export default node;
