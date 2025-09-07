/**
 * @generated SignedSource<<0218ff7869cc7873605f1dc6ddec969e>>
 * @relayHash 1dc6d5bc7ab0ac495b2a6c07e4a5ffaf
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1dc6d5bc7ab0ac495b2a6c07e4a5ffaf

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type pageSearchLocationSpecialityMetadataQuery$variables = {
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
export type pageSearchLocationSpecialityMetadataQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchLocationSpecialityMetadataFragment">;
};
export type pageSearchLocationSpecialityMetadataQuery = {
  response: pageSearchLocationSpecialityMetadataQuery$data;
  variables: pageSearchLocationSpecialityMetadataQuery$variables;
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
    "name": "pageSearchLocationSpecialityMetadataQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageSearchLocationSpecialityMetadataFragment",
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
    "name": "pageSearchLocationSpecialityMetadataQuery",
    "selections": (v19/*: any*/)
  },
  "params": {
    "id": "1dc6d5bc7ab0ac495b2a6c07e4a5ffaf",
    "metadata": {},
    "name": "pageSearchLocationSpecialityMetadataQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "27c7cce8d26911f5669a34362aa31143";

export default node;
