/**
 * @generated SignedSource<<bdb3ada8e15df291dcbfef5fa47065d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteOrganizationBannerModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "DeleteOrganizationBannerModalFragment";
};
export type DeleteOrganizationBannerModalFragment$key = {
  readonly " $data"?: DeleteOrganizationBannerModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationBannerModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteOrganizationBannerModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "4ea20b00270a9748467e993c153cd95b";

export default node;
