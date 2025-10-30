/**
 * @generated SignedSource<<c94fff7656fa285cb675044a53f63ff6>>
 * @relayHash dfa33f6112f2911174c190e5eea21bac
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID dfa33f6112f2911174c190e5eea21bac

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
  "name": "first",
  "variableName": "first"
},
v14 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v15 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v16 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v17 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v18 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v19 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v20 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v21 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v22 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v23 = {
  "kind": "Variable",
  "name": "zoomLevel",
  "variableName": "zoomLevel"
},
v24 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "coordinates",
    "storageKey": null
  }
],
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minSalary",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxSalary",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v30 = {
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
      (v10/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchMapViewQuery",
    "selections": [
      {
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
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/)
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
      (v1/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchMapViewQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v12/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/)
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
                "selections": (v24/*: any*/),
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
                  (v25/*: any*/),
                  (v26/*: any*/)
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
          (v27/*: any*/)
        ],
        "storageKey": null
      },
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
          (v21/*: any*/),
          (v22/*: any*/)
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
                  (v28/*: any*/),
                  (v29/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v29/*: any*/),
                      (v28/*: any*/),
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
                      (v30/*: any*/)
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
                    "selections": (v24/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  (v30/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
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
          (v27/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "dfa33f6112f2911174c190e5eea21bac",
    "metadata": {},
    "name": "pageSearchMapViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "66c89893d004ebf57e5fe907ddbf9a2b";

export default node;
