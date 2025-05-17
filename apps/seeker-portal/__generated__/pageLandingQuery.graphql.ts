/**
 * @generated SignedSource<<8ee6301cf90ec077e3b37e41885976c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CoordinatesInput = {
  latitude: number;
  longitude: number;
};
export type pageLandingQuery$variables = {
  coordinates?: CoordinatesInput | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
};
export type pageLandingQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"LandingClientComponentFragment">;
};
export type pageLandingQuery = {
  response: pageLandingQuery$data;
  variables: pageLandingQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "coordinates"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v3 = {
  "kind": "Variable",
  "name": "coordinates",
  "variableName": "coordinates"
},
v4 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v5 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v6 = [
  (v3/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v4/*: any*/),
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageLandingQuery",
    "selections": [
      {
        "args": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "LandingClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageLandingQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
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
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isSaved",
                    "storageKey": null
                  },
                  (v8/*: any*/),
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
                      (v8/*: any*/),
                      (v7/*: any*/)
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
                  (v9/*: any*/)
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
        "args": (v6/*: any*/),
        "filters": [
          "searchTerm",
          "coordinates",
          "proximityKm"
        ],
        "handle": "connection",
        "key": "JobListFragment_jobs",
        "kind": "LinkedHandle",
        "name": "jobs"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v9/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isViewerPayload"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v7/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f8d240769451a7ad593137010954c4bc",
    "id": null,
    "metadata": {},
    "name": "pageLandingQuery",
    "operationKind": "query",
    "text": "query pageLandingQuery(\n  $searchTerm: String\n  $coordinates: CoordinatesInput\n  $proximityKm: Float\n) {\n  ...LandingClientComponentFragment_3Qx6jN\n}\n\nfragment JobControlsAuthFragment on ViewerPayload {\n  __isViewerPayload: __typename\n  __typename\n}\n\nfragment JobControlsFragment on Job {\n  id\n  isSaved\n  ...ShareJobFragment\n}\n\nfragment JobFragment on Job {\n  ...JobControlsFragment\n  slug\n  title\n  type\n  workMode\n  location\n  skills\n  currency\n  hasSalaryRange\n  minSalary\n  maxSalary\n  hasExperienceRange\n  minExperience\n  maxExperience\n  createdAt\n  organization {\n    name\n    logoUrl\n    slug\n    id\n  }\n}\n\nfragment JobListFragment_3Qx6jN on Query {\n  ...JobListInternalFragment_3Qx6jN\n  viewer {\n    __typename\n    ...JobControlsAuthFragment\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment JobListInternalFragment_3Qx6jN on Query {\n  jobs(first: 10, searchTerm: $searchTerm, coordinates: $coordinates, proximityKm: $proximityKm) {\n    edges {\n      node {\n        id\n        ...JobFragment\n        ...JobControlsFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nfragment LandingClientComponentFragment_3Qx6jN on Query {\n  ...LandingViewFragment_3Qx6jN\n}\n\nfragment LandingViewFragment_3Qx6jN on Query {\n  ...JobListFragment_3Qx6jN\n}\n\nfragment ShareJobFragment on Job {\n  slug\n  title\n  description\n  organization {\n    name\n    logoUrl\n    slug\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "81740774bf5d10d781516123a3e0c460";

export default node;
