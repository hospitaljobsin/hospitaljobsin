/**
 * @generated SignedSource<<1671faff4481fde44565f02e2532f8cf>>
 * @relayHash 1c61de7ddead71891a3f10875ab0f74a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1c61de7ddead71891a3f10875ab0f74a

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
  bounds?: BoundingBoxInput | null | undefined;
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
v11 = [
  {
    "kind": "Variable",
    "name": "bounds",
    "variableName": "bounds"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "jobType",
    "variableName": "jobType"
  },
  {
    "kind": "Variable",
    "name": "location",
    "variableName": "location"
  },
  {
    "kind": "Variable",
    "name": "maxSalary",
    "variableName": "maxSalary"
  },
  {
    "kind": "Variable",
    "name": "minExperience",
    "variableName": "minExperience"
  },
  {
    "kind": "Variable",
    "name": "minSalary",
    "variableName": "minSalary"
  },
  {
    "kind": "Variable",
    "name": "proximityKm",
    "variableName": "proximityKm"
  },
  {
    "kind": "Variable",
    "name": "searchTerm",
    "variableName": "searchTerm"
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  {
    "kind": "Variable",
    "name": "workMode",
    "variableName": "workMode"
  }
],
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
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
    "name": "pageSearchMapViewQuery",
    "selections": [
      {
        "args": (v11/*: any*/),
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
      (v9/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchMapViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v11/*: any*/),
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
                  (v12/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GeoObject",
                    "kind": "LinkedField",
                    "name": "geo",
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
                    "name": "minSalary",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "maxSalary",
                    "storageKey": null
                  },
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
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v12/*: any*/),
                      (v13/*: any*/),
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
                      (v14/*: any*/)
                    ],
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalCount",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "1c61de7ddead71891a3f10875ab0f74a",
    "metadata": {},
    "name": "pageSearchMapViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "8d7f3d4ded46f8345f3c85cadd00009b";

export default node;
