/**
 * @generated SignedSource<<3e47debfac048adb9ee451fce762354e>>
 * @relayHash 35849b7d01ed8abc542abe794b7b61ba
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 35849b7d01ed8abc542abe794b7b61ba

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
export type pageSearchMapSpecialityViewQuery$variables = {
  bounds: BoundingBoxInput;
  jobType: ReadonlyArray<JobTypeFilter>;
  location?: string | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
  sortBy: JobSearchSortBy;
  workMode: ReadonlyArray<JobWorkModeFilter>;
  zoomLevel: number;
};
export type pageSearchMapSpecialityViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MapViewClientComponentFragment">;
};
export type pageSearchMapSpecialityViewQuery = {
  response: pageSearchMapSpecialityViewQuery$data;
  variables: pageSearchMapSpecialityViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "bounds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "zoomLevel"
},
v11 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v12 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v13 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v14 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v15 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v16 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v17 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v18 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchMapSpecialityViewQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "inputJobType",
            "variableName": "jobType"
          },
          {
            "kind": "Variable",
            "name": "inputLocation",
            "variableName": "location"
          },
          {
            "kind": "Variable",
            "name": "inputMaxSalary",
            "variableName": "maxSalary"
          },
          {
            "kind": "Variable",
            "name": "inputMinExperience",
            "variableName": "minExperience"
          },
          {
            "kind": "Variable",
            "name": "inputMinSalary",
            "variableName": "minSalary"
          },
          {
            "kind": "Variable",
            "name": "inputProximityKm",
            "variableName": "proximityKm"
          },
          {
            "kind": "Variable",
            "name": "inputSearchTerm",
            "variableName": "searchTerm"
          },
          {
            "kind": "Variable",
            "name": "inputSortBy",
            "variableName": "sortBy"
          },
          {
            "kind": "Variable",
            "name": "inputWorkMode",
            "variableName": "workMode"
          },
          {
            "kind": "Variable",
            "name": "inputZoomLevel",
            "variableName": "zoomLevel"
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
    "argumentDefinitions": [
      (v7/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/),
      (v9/*: any*/),
      (v1/*: any*/),
      (v10/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchMapSpecialityViewQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "bounds",
            "variableName": "bounds"
          },
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          {
            "kind": "Variable",
            "name": "zoomLevel",
            "variableName": "zoomLevel"
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
          (v19/*: any*/)
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
                  (v20/*: any*/)
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
              (v20/*: any*/)
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
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "kind": "Variable",
            "name": "sortBy",
            "variableName": "sortBy"
          },
          (v18/*: any*/)
        ],
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": false,
        "selections": [
          (v19/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "35849b7d01ed8abc542abe794b7b61ba",
    "metadata": {},
    "name": "pageSearchMapSpecialityViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "457f3aa1dcf8c588fbc3d365d90c7513";

export default node;
