/**
 * @generated SignedSource<<98f6e914cef5dffa5b5e1843102ffebe>>
 * @relayHash 505874f200e4275febac0f1052a5608e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 505874f200e4275febac0f1052a5608e

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
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "jobType"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "location"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "maxSalary"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "minExperience"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "minSalary"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "proximityKm"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchTerm"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workMode"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "zoomLevel"
  }
],
v1 = {
  "kind": "Variable",
  "name": "bounds",
  "variableName": "bounds"
},
v2 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v3 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v4 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v5 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v6 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v7 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v8 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v9 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v10 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v11 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v12 = {
  "kind": "Variable",
  "name": "zoomLevel",
  "variableName": "zoomLevel"
},
v13 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "coordinates",
    "storageKey": null
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minSalary",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxSalary",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
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
          (v11/*: any*/),
          (v12/*: any*/)
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
          (v1/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/)
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
                "selections": (v13/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "bounds",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SalaryRange",
                "kind": "LinkedField",
                "name": "salaryRange",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "topSpecialties",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": [
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
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "JobEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Job",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v17/*: any*/),
                  (v18/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v18/*: any*/),
                      (v17/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "logoUrl",
                        "storageKey": null
                      },
                      (v19/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GeoObject",
                    "kind": "LinkedField",
                    "name": "geo",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  (v19/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "currency",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "workMode",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "description",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "descriptionCleaned",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updatedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "skills",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "minExperience",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "maxExperience",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "505874f200e4275febac0f1052a5608e",
    "metadata": {},
    "name": "MapViewClientComponentRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "b46df5e368d6049aafcf66071667c122";

export default node;
