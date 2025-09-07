/**
 * @generated SignedSource<<d2deffffec2b81c10211bc1bbf831ba5>>
 * @relayHash 2500e2e20114f2160cde22a1074b7832
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2500e2e20114f2160cde22a1074b7832

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type pageSearchMetadataQuery$variables = {
  jobType: ReadonlyArray<JobTypeFilter>;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
  sortBy: JobSearchSortBy;
  workMode: ReadonlyArray<JobWorkModeFilter>;
};
export type pageSearchMetadataQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchMetadataFragment">;
};
export type pageSearchMetadataQuery = {
  response: pageSearchMetadataQuery$data;
  variables: pageSearchMetadataQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v8 = {
  "kind": "Literal",
  "name": "first",
  "value": 25
},
v9 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v10 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v11 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v12 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v13 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v14 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v15 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v16 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v17 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "totalCount",
    "storageKey": null
  }
];
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
      (v7/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchMetadataQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageSearchMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": [
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "kind": "Variable",
                "name": "location",
                "variableName": "location"
              },
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/)
            ],
            "concreteType": "JobConnection",
            "kind": "LinkedField",
            "name": "jobs",
            "plural": false,
            "selections": (v17/*: any*/),
            "storageKey": null
          }
        ],
        "args": [
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/)
        ],
        "argumentDefinitions": [
          (v0/*: any*/),
          {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "location"
          },
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v5/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v7/*: any*/),
      (v0/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchMetadataQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/)
        ],
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": false,
        "selections": (v17/*: any*/),
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "2500e2e20114f2160cde22a1074b7832",
    "metadata": {},
    "name": "pageSearchMetadataQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "9341330d9493187b3dd7b3a10dcaee87";

export default node;
