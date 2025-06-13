/**
 * @generated SignedSource<<10824cbb31f86584aba6ad8fb32c3434>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationSwitcherListFragment$data = {
  readonly id: string;
  readonly organizations: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly logoUrl: string;
        readonly name: string;
        readonly slug: string;
      };
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
    };
  };
  readonly " $fragmentType": "OrganizationSwitcherListFragment";
};
export type OrganizationSwitcherListFragment$key = {
  readonly " $data"?: OrganizationSwitcherListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationSwitcherListFragment">;
};

import OrganizationSwitcherListPaginationQuery_graphql from './OrganizationSwitcherListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "organizations"
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
      "defaultValue": 10,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": OrganizationSwitcherListPaginationQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "OrganizationSwitcherListFragment",
  "selections": [
    {
      "alias": "organizations",
      "args": null,
      "concreteType": "OrganizationConnection",
      "kind": "LinkedField",
      "name": "__OrganizationSwitcherListFragment_organizations_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "OrganizationEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Organization",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "slug",
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
    (v1/*: any*/)
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "27980f31455850403b0b06d0e16ffeab";

export default node;
