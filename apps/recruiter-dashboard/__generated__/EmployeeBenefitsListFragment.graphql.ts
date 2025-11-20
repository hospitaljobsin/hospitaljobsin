/**
 * @generated SignedSource<<1aa7472c3e6aec0701c5f2279b975236>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EmployeeBenefitsListFragment$data = {
  readonly employeeBenefits: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"EmployeeBenefitCardFragment">;
      };
    }>;
  };
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"CreateEmployeeBenefitModalFragment">;
  readonly " $fragmentType": "EmployeeBenefitsListFragment";
};
export type EmployeeBenefitsListFragment$key = {
  readonly " $data"?: EmployeeBenefitsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeBenefitsListFragment">;
};

import EmployeeBenefitsListPaginationQuery_graphql from './EmployeeBenefitsListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "employeeBenefits"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "after"
    },
    {
      "defaultValue": 100,
      "kind": "LocalArgument",
      "name": "first"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": EmployeeBenefitsListPaginationQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "EmployeeBenefitsListFragment",
  "selections": [
    (v1/*: any*/),
    {
      "alias": "employeeBenefits",
      "args": null,
      "concreteType": "EmployeeBenefitConnection",
      "kind": "LinkedField",
      "name": "__EmployeeBenefitsListFragment_employeeBenefits_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "EmployeeBenefitEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "EmployeeBenefit",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "EmployeeBenefitCardFragment"
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
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "ClientExtension",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__id",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CreateEmployeeBenefitModalFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
})();

(node as any).hash = "0384a0989226328ebcf928551d14ba70";

export default node;
