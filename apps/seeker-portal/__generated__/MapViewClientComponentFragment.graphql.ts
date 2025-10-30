/**
 * @generated SignedSource<<2904cc1042ac0f429c709e9d3683d0b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MapViewClientComponentFragment$data = {
  readonly jobClusters?: {
    readonly clusters: ReadonlyArray<{
      readonly bounds: ReadonlyArray<ReadonlyArray<number>>;
      readonly center: {
        readonly coordinates: ReadonlyArray<number>;
      };
      readonly count: number;
      readonly h3Index: string;
      readonly salaryRange: {
        readonly maxSalary: number | null | undefined;
        readonly minSalary: number | null | undefined;
      };
      readonly topSpecialties: ReadonlyArray<string>;
    }>;
    readonly totalCount: number;
  };
  readonly jobs?: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly geo: {
          readonly coordinates: ReadonlyArray<number>;
        } | null | undefined;
        readonly id: string;
        readonly organization: {
          readonly slug: string;
        } | null | undefined;
        readonly slug: string;
        readonly " $fragmentSpreads": FragmentRefs<"JobMapMarkersFragment_job" | "JobPreviewDrawerFragment_job">;
      };
    }>;
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "MapViewClientComponentFragment";
};
export type MapViewClientComponentFragment$key = {
  readonly " $data"?: MapViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MapViewClientComponentFragment">;
};

import MapViewClientComponentRefetchQuery_graphql from './MapViewClientComponentRefetchQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Variable",
  "name": "bounds",
  "variableName": "bounds"
},
v1 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v2 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v3 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v4 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v5 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v6 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v7 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v8 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v9 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "coordinates",
    "storageKey": null
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [
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
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [],
      "operation": MapViewClientComponentRefetchQuery_graphql
    }
  },
  "name": "MapViewClientComponentFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        (v8/*: any*/),
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
              "selections": (v9/*: any*/),
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
                }
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
        (v10/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        (v0/*: any*/),
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "first"
        },
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        {
          "kind": "Variable",
          "name": "sortBy",
          "variableName": "sortBy"
        },
        (v8/*: any*/)
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                (v11/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Organization",
                  "kind": "LinkedField",
                  "name": "organization",
                  "plural": false,
                  "selections": [
                    (v11/*: any*/)
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
                  "selections": (v9/*: any*/),
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "JobMapMarkersFragment_job"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "JobPreviewDrawerFragment_job"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        (v10/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "b46df5e368d6049aafcf66071667c122";

export default node;
