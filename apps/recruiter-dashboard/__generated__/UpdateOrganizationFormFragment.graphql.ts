/**
 * @generated SignedSource<<63f8de8a31eac272440ca9229053d980>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateOrganizationFormFragment$data = {
  readonly bannerUrl: string;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly slug: string;
  readonly website: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationBannerModalFragment" | "DeleteOrganizationLogoModalFragment">;
  readonly " $fragmentType": "UpdateOrganizationFormFragment";
};
export type UpdateOrganizationFormFragment$key = {
  readonly " $data"?: UpdateOrganizationFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateOrganizationFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateOrganizationFormFragment",
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
      "name": "slug",
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
      "name": "website",
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
      "name": "bannerUrl",
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
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteOrganizationLogoModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteOrganizationBannerModalFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "786b09c751745e74a9514b91902162d3";

export default node;
