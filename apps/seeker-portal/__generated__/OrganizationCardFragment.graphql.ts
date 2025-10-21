/**
 * @generated SignedSource<<fc6ac4780c1b2d0433b8808e9b385e05>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationCardFragment$data = {
  readonly descriptionCleaned: string | null | undefined;
  readonly id: string;
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly slug: string;
  readonly verificationStatus: {
    readonly __typename: string;
  };
  readonly " $fragmentType": "OrganizationCardFragment";
};
export type OrganizationCardFragment$key = {
  readonly " $data"?: OrganizationCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationCardFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "descriptionCleaned",
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
      "name": "logoUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "verificationStatus",
      "plural": false,
      "selections": [
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        },
        {
          "kind": "Literal",
          "name": "isActive",
          "value": true
        }
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
      "storageKey": "jobs(first:1,isActive:true)"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "86641635afc5bf4eda6ed4804a0f4a59";

export default node;
