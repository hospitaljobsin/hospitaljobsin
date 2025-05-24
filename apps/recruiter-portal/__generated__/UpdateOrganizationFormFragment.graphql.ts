/**
 * @generated SignedSource<<81b459e3d392550eb513be31671fca77>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateOrganizationFormFragment$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly slug: string;
  readonly website: string | null | undefined;
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
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "ddf8b31041cedd5404fa7a5583f82867";

export default node;
