/**
 * @generated SignedSource<<565feb3cbf2233750d6fa5d9d408190e>>
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
    }>;
    readonly totalCount: number;
  };
  readonly " $fragmentSpreads": FragmentRefs<"JobMapViewFragment" | "MapHeaderFragment" | "MapHeaderMobileFragment">;
  readonly " $fragmentType": "MapViewClientComponentFragment";
};
export type MapViewClientComponentFragment$key = {
  readonly " $data"?: MapViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MapViewClientComponentFragment">;
};

import MapViewClientComponentRefetchQuery_graphql from './MapViewClientComponentRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "bounds"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "jobType"
    },
    {
      "kind": "RootArgument",
      "name": "location"
    },
    {
      "kind": "RootArgument",
      "name": "maxSalary"
    },
    {
      "kind": "RootArgument",
      "name": "minExperience"
    },
    {
      "kind": "RootArgument",
      "name": "minSalary"
    },
    {
      "kind": "RootArgument",
      "name": "proximityKm"
    },
    {
      "kind": "RootArgument",
      "name": "searchTerm"
    },
    {
      "kind": "RootArgument",
      "name": "sortBy"
    },
    {
      "kind": "RootArgument",
      "name": "workMode"
    },
    {
      "kind": "RootArgument",
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
        {
          "kind": "Variable",
          "name": "bounds",
          "variableName": "bounds"
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
          "name": "workMode",
          "variableName": "workMode"
        },
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
              "name": "bounds",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MapHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MapHeaderMobileFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobMapViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "8a2106c334a0f6fafc81e2d9dda30dc1";

export default node;
