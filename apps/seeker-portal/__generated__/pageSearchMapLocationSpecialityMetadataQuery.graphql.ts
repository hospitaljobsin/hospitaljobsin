/**
 * @generated SignedSource<<4520dace27597a9e39de531a87d597e2>>
 * @relayHash 395f43e0b20ee8b51d25d5454d68bcba
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 395f43e0b20ee8b51d25d5454d68bcba

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type pageSearchMapLocationSpecialityMetadataQuery$variables = {
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
export type pageSearchMapLocationSpecialityMetadataQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchMapLocationSpecialityMetadataFragment">;
};
export type pageSearchMapLocationSpecialityMetadataQuery = {
  response: pageSearchMapLocationSpecialityMetadataQuery$data;
  variables: pageSearchMapLocationSpecialityMetadataQuery$variables;
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
  "name": "location"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v9 = [
  (v0/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v11 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v12 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v13 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v14 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v15 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v16 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v17 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v18 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v19 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 25
      },
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/),
      (v18/*: any*/)
    ],
    "concreteType": "JobConnection",
    "kind": "LinkedField",
    "name": "jobs",
    "plural": false,
    "selections": [
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
];
return {
  "fragment": {
    "argumentDefinitions": (v9/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchMapLocationSpecialityMetadataQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageSearchMapLocationSpecialityMetadataFragment",
        "selections": (v19/*: any*/),
        "args": [
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/)
        ],
        "argumentDefinitions": (v9/*: any*/)
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v6/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v8/*: any*/),
      (v0/*: any*/),
      (v7/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchMapLocationSpecialityMetadataQuery",
    "selections": (v19/*: any*/)
  },
  "params": {
    "id": "395f43e0b20ee8b51d25d5454d68bcba",
    "metadata": {},
    "name": "pageSearchMapLocationSpecialityMetadataQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "2a5388213832ae865824decc2b36de70";

export default node;
