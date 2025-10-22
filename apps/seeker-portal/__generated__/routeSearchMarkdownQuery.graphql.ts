/**
 * @generated SignedSource<<c5a77dd332fde72e9364f5faaa597b21>>
 * @relayHash 6bdb2d733ed4e55eb24dfe52be735265
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6bdb2d733ed4e55eb24dfe52be735265

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type routeSearchMarkdownQuery$variables = {
  after?: string | null | undefined;
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
export type routeSearchMarkdownQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"routeSearchMarkdownFragment">;
};
export type routeSearchMarkdownQuery = {
  response: routeSearchMarkdownQuery$data;
  variables: routeSearchMarkdownQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
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
v10 = [
  (v0/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/)
],
v11 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v12 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v13 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v14 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v15 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v16 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v17 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v18 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v19 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v20 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v21 = [
  (v11/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  },
  (v12/*: any*/),
  (v13/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/),
  (v16/*: any*/),
  (v17/*: any*/),
  (v18/*: any*/),
  (v19/*: any*/),
  (v20/*: any*/)
],
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workMode",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minSalary",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxSalary",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minExperience",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxExperience",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v10/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeSearchMarkdownQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "routeSearchMarkdownFragment",
        "selections": [
          {
            "alias": null,
            "args": (v21/*: any*/),
            "concreteType": "JobConnection",
            "kind": "LinkedField",
            "name": "jobs",
            "plural": false,
            "selections": [
              (v22/*: any*/),
              (v23/*: any*/),
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
                      (v24/*: any*/),
                      (v25/*: any*/),
                      (v26/*: any*/),
                      (v27/*: any*/),
                      (v28/*: any*/),
                      (v29/*: any*/),
                      (v30/*: any*/),
                      (v31/*: any*/),
                      (v32/*: any*/),
                      (v33/*: any*/),
                      (v34/*: any*/),
                      (v35/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Organization",
                        "kind": "LinkedField",
                        "name": "organization",
                        "plural": false,
                        "selections": [
                          (v36/*: any*/),
                          (v26/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "args": [
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/)
        ],
        "argumentDefinitions": (v10/*: any*/)
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v7/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v2/*: any*/),
      (v9/*: any*/),
      (v1/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Operation",
    "name": "routeSearchMarkdownQuery",
    "selections": [
      {
        "alias": null,
        "args": (v21/*: any*/),
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": false,
        "selections": [
          (v22/*: any*/),
          (v23/*: any*/),
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
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  (v28/*: any*/),
                  (v29/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/),
                  (v32/*: any*/),
                  (v33/*: any*/),
                  (v34/*: any*/),
                  (v35/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v36/*: any*/),
                      (v26/*: any*/),
                      (v24/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "6bdb2d733ed4e55eb24dfe52be735265",
    "metadata": {},
    "name": "routeSearchMarkdownQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "023253e94e1a0bad7e1320c6bd483df4";

export default node;
