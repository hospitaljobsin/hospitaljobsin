/**
 * @generated SignedSource<<fd2882a1ab62ce61a29fe92ef9f104fc>>
 * @relayHash 84a175bb8f72e21f580d22d6118f49a4
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 84a175bb8f72e21f580d22d6118f49a4

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobTypeFilter = "ANY" | "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "ANY" | "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type CoordinatesInput = {
  latitude: number;
  longitude: number;
};
export type JobListRefetchQuery$variables = {
  coordinates?: CoordinatesInput | null | undefined;
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  jobType?: JobTypeFilter | null | undefined;
  maxExperience?: number | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
  workMode?: JobWorkModeFilter | null | undefined;
};
export type JobListRefetchQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobListInternalFragment">;
};
export type JobListRefetchQuery = {
  response: JobListRefetchQuery$data;
  variables: JobListRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "coordinates"
  },
  {
    "defaultValue": 10,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": "ANY",
    "kind": "LocalArgument",
    "name": "jobType"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "maxExperience"
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
    "defaultValue": "ANY",
    "kind": "LocalArgument",
    "name": "workMode"
  }
],
v1 = {
  "kind": "Variable",
  "name": "coordinates",
  "variableName": "coordinates"
},
v2 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v3 = {
  "kind": "Variable",
  "name": "maxExperience",
  "variableName": "maxExperience"
},
v4 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v5 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v6 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v7 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v8 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v9 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v10 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "JobListRefetchQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "JobListInternalFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "JobListRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v10/*: any*/),
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
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isSaved",
                    "storageKey": null
                  },
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
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
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
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
                      (v12/*: any*/),
                      (v11/*: any*/)
                    ],
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
                    "name": "location",
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
                    "name": "currency",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasSalaryRange",
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
                    "name": "hasExperienceRange",
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
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
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v10/*: any*/),
        "filters": [
          "searchTerm",
          "coordinates",
          "proximityKm",
          "minExperience",
          "maxExperience",
          "minSalary",
          "maxSalary",
          "workMode",
          "jobType"
        ],
        "handle": "connection",
        "key": "JobListFragment_jobs",
        "kind": "LinkedHandle",
        "name": "jobs"
      }
    ]
  },
  "params": {
    "id": "84a175bb8f72e21f580d22d6118f49a4",
    "metadata": {},
    "name": "JobListRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "38c4b851b248b5eaa08ac462b93d2692";

export default node;
