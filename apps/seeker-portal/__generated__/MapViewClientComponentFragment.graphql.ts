/**
 * @generated SignedSource<<539dfee9612cc55c4f1af29de65d526c>>
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
    readonly locationViewport: {
      readonly latitude: number;
      readonly longitude: number;
      readonly zoomLevel: number;
    } | null | undefined;
    readonly totalCount: number;
  };
  readonly " $fragmentSpreads": FragmentRefs<"JobMapViewFragment" | "MapHeaderFragment">;
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
  "name": "jobType",
  "variableName": "inputJobType"
},
v1 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "inputLocation"
},
v2 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "inputMaxSalary"
},
v3 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "inputMinExperience"
},
v4 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "inputMinSalary"
},
v5 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "inputProximityKm"
},
v6 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "inputSearchTerm"
},
v7 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "inputWorkMode"
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "bounds"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputJobType"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputLocation"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputMaxSalary"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputMinExperience"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputMinSalary"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputProximityKm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputSearchTerm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputSortBy"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputWorkMode"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inputZoomLevel"
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
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        {
          "kind": "Variable",
          "name": "zoomLevel",
          "variableName": "inputZoomLevel"
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
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "LocationViewport",
          "kind": "LinkedField",
          "name": "locationViewport",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "latitude",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "longitude",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "zoomLevel",
              "storageKey": null
            }
          ],
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
      "args": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        {
          "kind": "Variable",
          "name": "sortBy",
          "variableName": "inputSortBy"
        },
        (v7/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "JobMapViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "ca2419df881a0153f76e933c3603b8aa";

export default node;
