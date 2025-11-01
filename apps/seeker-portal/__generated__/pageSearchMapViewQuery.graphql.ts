/**
 * @generated SignedSource<<afd790e85f9d8b90c00c117ccbf06f61>>
 * @relayHash deee98497a82a1d1c47c9496368d4641
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID deee98497a82a1d1c47c9496368d4641

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
export type pageSearchMapViewQuery$variables = {
  bounds: BoundingBoxInput;
  first: number;
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
export type pageSearchMapViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MapViewClientComponentFragment">;
};
export type pageSearchMapViewQuery = {
  response: pageSearchMapViewQuery$data;
  variables: pageSearchMapViewQuery$variables;
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
  "name": "first"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "zoomLevel"
},
v12 = {
  "kind": "Variable",
  "name": "bounds",
  "variableName": "bounds"
},
v13 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v14 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v15 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v16 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v17 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v18 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v19 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v20 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v22 = {
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
      (v10/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchMapViewQuery",
    "selections": [
      {
        "args": null,
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
      (v8/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v4/*: any*/),
      (v7/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v10/*: any*/),
      (v2/*: any*/),
      (v11/*: any*/),
      (v9/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchMapViewQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
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
          (v21/*: any*/)
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
                  (v22/*: any*/)
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
              (v22/*: any*/)
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
          (v12/*: any*/),
          {
            "kind": "Variable",
            "name": "first",
            "variableName": "first"
          },
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          {
            "kind": "Variable",
            "name": "sortBy",
            "variableName": "sortBy"
          },
          (v20/*: any*/)
        ],
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": false,
        "selections": [
          (v21/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "deee98497a82a1d1c47c9496368d4641",
    "metadata": {},
    "name": "pageSearchMapViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4267a4d27e7c16fcc54f93b735c1c476";

export default node;
